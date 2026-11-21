type RequestNode = {
    next: RequestNode | null,
    value: number,
};

type RequestQueue = {
    head: RequestNode | null;
    tail: RequestNode | null;
    listLength: number;
};

class RateLimiter {
    private requests: Map<string, RequestQueue> = new Map();

    constructor(
        private limit: number,
        private windowSize: number
    ) {
        setInterval( () => {
            for (const [userId, timestamps] of this.requests) {
                this.cleanupInactiveUsers(timestamps, userId);
            }
        }
        , 60000)
    }

        private addToTail(
        queue: RequestQueue,
        newTimestamp: number
        ){  
            const newReqNode =  { next: null, value: newTimestamp };
            if (queue.tail){
                queue.tail.next = newReqNode;
                queue.tail = newReqNode;
            }else{
                queue.head = newReqNode;
                queue.tail = newReqNode;
            }
            queue.listLength++;
        }

        private cleanupInactiveUsers(timestamps: RequestQueue, userId: string){
            this.removeExpired(userId, timestamps, Date.now());
            if (timestamps.head === null && timestamps.tail === null){
                this.requests.delete(userId);
            }
        }
        
        private removeExpired(
        userId: string,
        timestamps: RequestQueue,
        currentTimestamp: number
    ): void {
        while (timestamps.listLength && currentTimestamp - timestamps.head?.value! >= this.windowSize){
            if (timestamps.head){
            timestamps.head =  timestamps.head?.next;
            timestamps.listLength--;
                if (timestamps.listLength === 0){
                    timestamps.tail = null;
                } 
            }
        }
    }

    private queueInit(userId: string, timestamp: number){
            const firstNode = {value: timestamp, next: null};
            const newQueue: RequestQueue = { head: firstNode, tail: firstNode, listLength: 1};
            this.requests.set(userId, newQueue);
            return true;

    }

    allowRequest(userId: string, timestamp: number): boolean {
        if (this.limit < 1) return false;
        const userIdTimestamps = this.requests.get(userId);
        if (!userIdTimestamps){
            return this.queueInit(userId, timestamp);
        }else{
                this.removeExpired(userId, userIdTimestamps, timestamp);
                if (userIdTimestamps?.listLength < this.limit){
                    this.addToTail(userIdTimestamps, timestamp);
                    return true;
                }else{
                    // later reject with 429 as this function returns boolean
                    return false;
                }
        }
    }
}