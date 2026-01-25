import { GoogleGenerativeAI } from '@google/generative-ai'
import { QuotaManager } from '@/lib/quota-manager'

export async function POST(request: Request) {
  try {
    const { prompt, audio, modelId } = await request.json()
    
    // Initialize API keys if not already done
    QuotaManager.initializeApiKeys()
    
    // Get current API key (primary or backup)
    const apiKey = QuotaManager.getCurrentApiKey()
    
    if (!apiKey) {
      return Response.json({ 
        error: 'No Gemini API key available' 
      }, { status: 500 })
    }

    // Check if we should wait for rate limiting
    if (QuotaManager.shouldWaitForRateLimit()) {
      return Response.json({ 
        error: 'Rate limit: Please wait a moment before making another request',
        retryAfter: 2
      }, { status: 429 })
    }

    // Check if quota is exhausted and try to switch to backup
    if (QuotaManager.isQuotaExhausted()) {
      const hasBackup = typeof (QuotaManager as any).hasBackupApiKey === 'function' 
        ? QuotaManager.hasBackupApiKey() 
        : false
      if (hasBackup) {
        const switched = QuotaManager.switchToBackupApiKey()
        if (switched) {
          // Retry with backup API key
          return POST(request)
        }
      }
      
      return Response.json({ 
        error: 'Daily quota exceeded. Please try again tomorrow.',
        hasBackup: hasBackup
      }, { status: 429 })
    }

    // Record API call for rate limiting
    QuotaManager.recordApiCall()
    
    // Decrease quota
    const quotaInfo = QuotaManager.decreaseQuota()
    
    const genAI = new GoogleGenerativeAI(apiKey)
    
    let result;

    // Prefer the latest model IDs; fall back to alternatives if unsupported
    const candidateModels = modelId
      ? [modelId]
      : ['gemini-1.5-flash-latest']

    const tryGenerate = async (modelId: string) => {
      const model = genAI.getGenerativeModel({ model: modelId })
      if (audio) {
        console.log("Processing audio transcription in English...")
        const fileData = {
          inlineData: {
            data: audio,
            mimeType: 'audio/webm'
          }
        }
        const enhancedPrompt = `${prompt}\n\nImportant: The audio is in English language. Please transcribe it accurately in English only. Do not translate to any other language.`
        return await model.generateContent([
          enhancedPrompt,
          fileData
        ])
      }
      return await model.generateContent(prompt)
    }

    let lastErr: unknown = null
    for (const modelId of candidateModels) {
      try {
        console.log(`Trying Gemini model: ${modelId}`)
        result = await tryGenerate(modelId)
        break
      } catch (e) {
        lastErr = e
        const msg = e instanceof Error ? e.message.toLowerCase() : ''
        // Only fall through on explicit unsupported model errors
        if (msg.includes('404') || msg.includes('not found') || msg.includes('not supported')) {
          console.warn(`Model unsupported or not found: ${modelId}`)
          continue
        }
        throw e
      }
    }

    if (!result) {
      // Try to discover available models and attempt them automatically
      const listResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`).catch(() => null)
      let availableModelIds: string[] = []
      if (listResp && listResp.ok) {
        const data = await listResp.json().catch(() => null)
        if (Array.isArray(data?.models)) {
          availableModelIds = data.models
            .map((m: any) => (typeof m?.name === 'string' ? m.name : ''))
            .filter(Boolean)
            .map((name: string) => name.replace(/^models\//, ''))
        }
      }

      // Prioritize -latest, then 1.5-pro, then 1.5-flash
      const prioritized = availableModelIds.sort((a, b) => {
        const score = (id: string) => (
          (id.includes('latest') ? 4 : 0) +
          (id.includes('1.5-pro') ? 3 : 0) +
          (id.includes('1.5-flash') ? 2 : 0) +
          (id.includes('pro') ? 1 : 0)
        )
        return score(b) - score(a)
      })

      for (const mid of prioritized) {
        try {
          console.log(`Trying discovered Gemini model: ${mid}`)
          result = await tryGenerate(mid)
          if (result) break
        } catch (e) {
          const msg = e instanceof Error ? e.message.toLowerCase() : ''
          if (msg.includes('404') || msg.includes('not found') || msg.includes('not supported')) {
            continue
          }
          // For other errors, stop and report
          throw e
        }
      }

      if (!result) {
        const err = lastErr instanceof Error ? lastErr.message : 'No supported Gemini model available'
        return Response.json({
          error: 'Model not available for your API key/version',
          details: err,
          tried: candidateModels,
          availableModels: availableModelIds.slice(0, 15)
        }, { status: 404 })
      }
    }
    
    const response = await result.response
    const text = response.text()

    return Response.json({ 
      response: text,
      quotaInfo: {
        remaining: quotaInfo.remaining,
        total: quotaInfo.total,
        apiKeyIndex: quotaInfo.apiKeyIndex
      }
    })
  } catch (error) {
    console.error('Gemini API error:', error)
    
    let errorMessage = 'Failed to generate content'
    let statusCode = 500
    let shouldRetryWithBackup = false
    
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('rate limit')) {
        errorMessage = 'API rate limit exceeded. Please wait a few minutes before trying again.'
        statusCode = 429
        
        // Try switching to backup API key if available
        if (typeof (QuotaManager as any).hasBackupApiKey === 'function' && QuotaManager.hasBackupApiKey()) {
          const switched = QuotaManager.switchToBackupApiKey()
          if (switched) {
            shouldRetryWithBackup = true
          }
        }
      } else if (error.message.includes('API_KEY_INVALID')) {
        errorMessage = 'Invalid API key. Please check your API configuration.'
        statusCode = 401
        
        // Try switching to backup API key if available
        if (typeof (QuotaManager as any).hasBackupApiKey === 'function' && QuotaManager.hasBackupApiKey()) {
          const switched = QuotaManager.switchToBackupApiKey()
          if (switched) {
            shouldRetryWithBackup = true
          }
        }
      } else if (error.message.includes('quota_exceeded')) {
        errorMessage = 'Daily quota exceeded. Please try again tomorrow.'
        statusCode = 429
        
        // Try switching to backup API key if available
        if (typeof (QuotaManager as any).hasBackupApiKey === 'function' && QuotaManager.hasBackupApiKey()) {
          const switched = QuotaManager.switchToBackupApiKey()
          if (switched) {
            shouldRetryWithBackup = true
          }
        }
      }
    }
    
    // If we can retry with backup API key, do so
    if (shouldRetryWithBackup) {
      try {
        return await POST(request)
      } catch (retryError) {
        console.error('Backup API key also failed:', retryError)
        // Fall through to return the original error
      }
    }
    
    return Response.json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error',
      retryAfter: statusCode === 429 ? 300 : undefined, // Suggest retry after 5 minutes for rate limits
      hasBackup: typeof (QuotaManager as any).hasBackupApiKey === 'function' 
        ? QuotaManager.hasBackupApiKey() 
        : false
    }, { status: statusCode })
  }
}
