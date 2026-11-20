class RateLimiter {
    private requests: Map<string, number[]> = new Map;

    constructor(
        private limit: number,
        private windowSize: number 
    ) {}

        private removeExpired(
        timestamps: number[],
        currentTimestamp: number
    ): void {
        while (timestamps.length && currentTimestamp - timestamps[0]! >= this.windowSize){
            timestamps.shift();
        }
    }

    allowRequest(userId: string, timestamp: number): boolean {
        if (this.limit < 1) return false;
        if (!this.requests.has(userId)){
            this.requests.set(userId, [timestamp])
            return true;
        }

            let userIdTimestamps = this.requests.get(userId);
            this.removeExpired(userIdTimestamps!, timestamp);
            if (userIdTimestamps?.length! < this.limit){
                userIdTimestamps?.push(timestamp);
                return true;
            }else{
                // later reject with 429 as this function returns boolean
                return false;
            }

    }
}