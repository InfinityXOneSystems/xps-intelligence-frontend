import { successResponse, errorResponse, generateTraceId, logApiCall, withTimeout } from '../../_lib/utils'

}
export default asy
 

      headers: { 'Content-Type': 'application/json' }
  }
  
  if (req.method !== 'POST') {
    return new Response(JSON.stringify(errorResponse('METHOD_NOT_ALLOWED', 'Only POST allowed', undefined, undefined, traceId)), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

      return new Response(JSON.stringify(errorResponse(

       
      )), {
        headers: { 'Content-Type': 'app
    }

      return new 
        'Supabase URL not configured',
        'Set SUPABASE_URL 
      )), {
        headers: {
    }
    const testR
        hea
          'Authoriza
      }),
    )
    i

        { status: testResponse.status },
        traceId
        status: 401,
      })

      status: 'con
      url: supabaseUrl,
    }, traceId)
      heade
  } catch (error) {
      'CONNECTION_ERROR',
      un
     

    })
}











































