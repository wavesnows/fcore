import Queue from './Queue';

interface IOper
{
    /**
     * Execute right now
     * 
     */		
    execute():void
    
    /**
     * Succeed Function
     * 
     */		
    result(event:any):void
    
    /**
     * Fault Function
     * 
     */		
    fault(event:any):void
    
    /**
     * Push to queue
     * 
     * @param queue	used queue, if null, use the default one.
     * 
     */
    commit(queue:Queue|null):void
    
    /**
     * Halt queue
     * 
     */
    halt():void
}