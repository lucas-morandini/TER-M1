import axios from 'axios';
/**
 * Gère les erreurs d'API de manière standardisée
 */
export class HttpUtils{
    handleApiError(message: string, error: string) {
        if (axios.isAxiosError(error)) {
            console.error(`${message}: ${error.message}`);
            
            if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            }
        } else {
            console.error(`${message}: ${error}`);
        }
        
        throw new Error(message);
    }
    
    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async withRetry(fn: Function, maxRetries : number = 3, baseDelay : number = 1000) {
        let retries = 0;
        
        while (true) {
            try {
                return await fn();
            } catch (error) {
                retries++;
                
                if (retries > maxRetries) {
                    throw error;
                }
                
                const delayTime = baseDelay * Math.pow(2, retries - 1);
                console.log(`Retry ${retries}/${maxRetries} after ${delayTime}ms`);
                await this.delay(delayTime);
            }
        }
    }
}