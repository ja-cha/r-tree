import { RTreeEntry, RTreeIface } from './RTree'


const arrayCopy = (src: any[], srcStartPosition: number, dst: any[], dstStartPosition: number, lengthOfCopy: number) => {
    // the index to begin splicing from dst array
    let start;
    let end;

    if (typeof lengthOfCopy !== 'undefined') {
        end = Math.min(lengthOfCopy, src.length);
        start = dstStartPosition;
        src = src.slice(srcStartPosition, end + srcStartPosition);
    } else {
        if (typeof dst !== 'undefined') {
            // src, dst, length
            end = Math.min(dst.length, src.length);
            console.log(end)
        } else {
            // src, dst
            end = src.length;
        }

        start = 0;
        src = src.slice(0, end);
    }


    let result = [start, end].concat(src);
    // @ts-ignore
    return Array.prototype.splice.apply(dst, result);
};

const copyOf = <A>(src: A[], length: number): A[] => {
    let initialized: A[] = Array.from({ length: length });
    return initialized.map((_, i) => src[i]);
}

interface DistanceCalculator {
    distance<A>(x: number, y: number, t: RTreeIface<A>): number;
}

const distanceCalculatorImpl: DistanceCalculator = (<DistanceCalculator>{
    distance<A>(x: number, y: number, t: RTreeIface<A>) {
        var dx = t.getMinX() - x
        var dy = t.getMinY() - y
        if (dx < 0) {
            dx = x - t.getMaxX()
            if (dx < 0) dx = 0
        }
        if (dy < 0) {
            dy = y - t.getMaxY()
            if (dy < 0) dy = 0
        }
        if (dy == 0) return dx
        else if (dx == 0) return dy
        else return Math.sqrt(dx * dx + dy * dy)
    }
});

class DejaVuCounter {
    private n: number;
    constructor() {
        this.n = 0;
    }
    inc = (): void => {
        this.n += 1;
    }
    decIfPositive = (): boolean => {
        if (this.n > 0) {
            this.n -= 1;
            return false
        } else
            return true;
    }
}

class RTreeEntryBinaryHeap<A> {

    private size: number = 0
    private maxDist: number;
    private maxSize: number;
    private distances: number[] = [... new Array(2)].fill(0);//Array.from<number>({ length: 16 });
    private entries: RTreeEntry<A>[] = [... new Array(2)].fill(null);// Array.from<RTreeEntry<A>>({ length: 16 });

    constructor(maxDist: number, maxSize: number) {
        this.maxDist = maxDist;
        this.maxSize = maxSize;
    }

    put = (d: number, e: RTreeEntry<A>): number => {
        var distances_ = this.distances
        var entries_ = this.entries
         if (this.size < this.maxSize) {
            this.size += 1
            if (this.size >= distances_.length) {
                let newSize = Math.min(distances_.length << 1, this.maxSize + 1)
                distances_ = copyOf(distances_, newSize)
                entries_ = copyOf(entries_, newSize)
                this.distances = distances_
                this.entries = entries_
            }
            let i = this.size;
            let j = this.size;
            const condition = (): boolean => {
                j >>= 1;
                return j > 0 && d >= distances_[j];
            }
            while (condition()) {
                distances_[i] = distances_[j];
                entries_[i] = entries_[j];
                i = j;
            }
            distances_[i] = d
            entries_[i] = e
            if (this.size == this.maxSize)
                return distances_[1]
            else
                return this.maxDist
        } else if (this.size > 0 && d < distances_[1]) {
            let i_ = 1;
            let j_ = 1;
            const condition = (): boolean => {
                j_ <<= 1;
                let k_ = j_ + 1
                if (k_ <= this.size && distances_[k_] >= distances_[j_]) {
                    j_ = k_
                }
                return j_ <= this.size && distances_[j_] >= d;
            }
            while (condition()) {
                distances_[i_] = distances_[j_]
                entries_[i_] = entries_[j_]
                i_ = j_
            }
            distances_[i_] = d
            entries_[i_] = e
            return distances_[1]
        } else return this.maxDist;
    }

    toIndexedSeq = ():IndexedSeq<RTreeEntry<A>>=> {
        return new ShiftedRTreeEntryIndexedSeq(this.entries, this.size);
    }
}

class IndexOutOfBoundsException extends Error {
    constructor(s: string){
        super(s);
    }    
}

class IllegalArgumentException  extends Error {
    constructor(s: string){
        super(s);
    }    
}

class IndexedSeq<A> extends Array<A>{ 
     
    constructor(array: A[], size:number) {
       super(size)
       if(size==0){
        [...this];
       }else if(size < array.length){        
        //remove undefined values and build array
        array.filter(Boolean).forEach((element, index) => {             
            this[index] = element;
        })
       }else{
        array.forEach((element, index) => {             
            this[index] = element;
        })
       }         
    } 
    get = (idx: number): A => {
    
        if (idx < 0 || idx >= this.length){
            throw new IndexOutOfBoundsException(idx.toString());
        }
        return this[idx];
    }     
   override  map = <B>(f:(value: A , index: number, array: A[])=>B): IndexedSeq<B> => {
        let n = [];
        for (let i=0; i<this.length; i++) {
            let b = f(this[i], i, this);
            n.push(b);
        }
        return new IndexedSeq(n,this.length);
    }
     
  
}

class ShiftedRTreeEntryIndexedSeq<A> extends IndexedSeq<RTreeEntry<A>>{
    constructor(array:  RTreeEntry<A>[], size:number) {
        super(array, size);
     }      
}

class RTreeEntryIndexedSeq<A> extends IndexedSeq<RTreeEntry<A>>{
    constructor(array:  RTreeEntry<A>[], size:number) {
        super(array, size);        
     }  
    
}

class AdaptedRTreeEntryIndexedSeq<A> extends IndexedSeq<RTreeEntry<A>>{
    constructor(array:  RTreeIface<A>[]){
        super(array as RTreeEntry<A>[],  array.length);
     }     
     
}

  /**
    * Create an entry for a rectangle and a value.
    *
    * @param minX x coordinate of the left bottom corner
    * @param minY y coordinate of the left bottom corner
    * @param maxX x coordinate of the right top corner
    * @param maxY y coordinate of the right top corner
    * @param value a value to store in the r-tree
    * @tparam A a type of the value being put in the r-tree
    * @return a newly created entry
    */
const mkRectangleEntry = <A>(minX: number, minY: number, maxX: number, maxY: number, value: A): RTreeEntry<A> => {
    if (!(maxX >= minX))
      throw new IllegalArgumentException("maxX should be greater than minX and any of them should not be NaN")
    if (!(maxY >= minY))
      throw new IllegalArgumentException("maxY should be greater than minY and any of them should not be NaN")
   return new RTreeEntry<A>(minX, minY, maxX, maxY, value)
  }

  /**
    * 
    * Create an entry for a point and a value.
    *
    * @param x x value of the given point
    * @param y y value of the given point
    * @param value a value to store in the r-tree
    * @tparam A a type of the value being put in the r-tree
    * @return a newly created entry
    */
 const mkPointEntry = <A>(x: number, y: number, value: A): RTreeEntry<A> => {
    if (x != x) throw new IllegalArgumentException("x should not be NaN")
    if (y != y) throw new IllegalArgumentException("y should not be NaN")
    return new RTreeEntry<A>(x, y, x, y, value)
  }

  /**
    * Create an entry specified by center point with distance and a value.
    *
    * @param x x value of the given point
    * @param y y value of the given point
    * @param distance a value of distance to edges of the entry bounding box
    * @param value a value to store in the r-tree
    * @tparam A a type of the value being put in the r-tree
    * @return a newly created entry
    */
  const mkCenterPointEntry = <A>(x: number, y: number, distance: number, value: A): RTreeEntry<A> => {
    if (x != x) throw new IllegalArgumentException("x should not be NaN")
    if (y != y) throw new IllegalArgumentException("y should not be NaN")
    if (!(distance >= 0)) throw new IllegalArgumentException("distance should not be less than 0 or NaN")
    return new RTreeEntry<A>(x - distance, y - distance, x + distance, y + distance, value)
  }

  class StringBuilder  {
    
    utf8Decoder:TextDecoder;
    utf8Encoder:TextEncoder;
    bufferConsumed:number;
    capacity:number;
    buffer:Uint8Array;

    constructor(){
        // cannot use String.fromCharCode due to
        // Uncaught RangeError: Maximum call stack size exceeded
        // so we are stuck with TextEncoder and TextDecoder
        // https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
        this.utf8Decoder = new TextDecoder();
        this.utf8Encoder = new TextEncoder();
        
        this.bufferConsumed = 0;
        this.capacity = 128;
        this.buffer = new Uint8Array(128);
    };

      append = (strToAdd:string) => {
        // O(N) copy but ammortized to O(1) over all concats
        var encodedStr = this.utf8Encoder.encode(strToAdd);
        while (encodedStr.length + this.bufferConsumed > this.capacity) {
            var tmpBuffer = this.buffer;
            this.buffer = new Uint8Array(this.capacity*2);
            this.capacity = this.capacity*2;
            for(var i = 0; i < this.bufferConsumed; i++) {
                this.buffer[i] = tmpBuffer[i];
            }
        }

        // add the characters to the end
        for(var i = 0; i < encodedStr.length; i++) {
            this.buffer[i+this.bufferConsumed] = encodedStr[i];
        }
        this.bufferConsumed += encodedStr.length;

        return this;
    }

      build = () => {
        return this.utf8Decoder.decode(this.buffer.slice(0, this.bufferConsumed));
    }
}

export {
    mkRectangleEntry,
    mkPointEntry,
    mkCenterPointEntry,
    IndexOutOfBoundsException, 
    IllegalArgumentException,
    IndexedSeq, 
    DistanceCalculator, 
    distanceCalculatorImpl, 
    arrayCopy, 
    copyOf, 
    DejaVuCounter,
    RTreeEntryBinaryHeap, 
    ShiftedRTreeEntryIndexedSeq, 
    RTreeEntryIndexedSeq, 
    AdaptedRTreeEntryIndexedSeq ,
    StringBuilder
    
}
