function Emoji() {
   return function (target: object, key: string) {
      console.log({ target, key });
      let val: string = target[key as keyof typeof target];

      function getter() {
         return val;
      }
      function setter(next: string) {
         val = `😔${next}😔`;
      }
      Object.defineProperty(target, key, {
         get: getter,
         set: setter,
         enumerable: true,
         configurable: true,
      });
   };
}

function Acessor() {
   return function (target: object, key: string, descriptor: PropertyDescriptor) {
      const original = descriptor.get;

      descriptor.get = function () {
         const result: number = original?.apply(this);
         return result + 2;
      };

      return descriptor;
   };
}

export class Teste {
   @Emoji()
   flavor = "vanilla";

   @Acessor()
   public get price() {
      return 5;
   }
}

const t = new Teste();
console.log(t.flavor); // "vanilla"

t.flavor = "chocolate";
console.log(t.flavor); // "chocolate"

t.flavor = "chocolate";
console.log(t.price); // "chocolate"
