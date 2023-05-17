export default function location(self: any) {
    self.__dynamic$history = {
        apply(t: any, g: any, a: any) {
            if (a[2]) a[2] = self.__dynamic.url.encode(a[2], self.__dynamic.meta);

            var moved = Reflect.apply(t, g, a);

            self.__dynamic.client.location(self);

            return moved;
        }
    }
    
    self.history.pushState = new Proxy(self.history.pushState, self.__dynamic$history);
    self.history.replaceState = new Proxy(self.history.replaceState, self.__dynamic$history);

    self.history.pushState = new Proxy(self.history.pushState, self.__dynamic$history);
    self.history.replaceState = new Proxy(self.history.replaceState, self.__dynamic$history);
}