type Subscriber = () => void;

export default class TriggerBus {
   private subscribers = new Set<Subscriber>();

   subscribe(callback: Subscriber): () => void {
      this.subscribers.add(callback);
      return () => this.subscribers.delete(callback);
   }

   emit() {
      for (const cb of this.subscribers) {
         cb();
      }
   }
}

export const triggerBus = new TriggerBus();
