export class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  has(item: T): boolean {
    return this.items.includes(item);
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
