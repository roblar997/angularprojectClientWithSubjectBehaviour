export class FenwFeatureTree {
  size: number;
  tree: number[] = [];
  constructor(size : number) {
    this.size = size
    this.tree = []
    for (let i = 0; i < size; i++) {
      this.tree[i] = 0
    }
  }

  update(timeSlot : number, val : number) {
    if (timeSlot == 0) return //must start at 1
    while (timeSlot < this.size) {
      this.tree[timeSlot] += val
      timeSlot += timeSlot & (-timeSlot)
    }
  }



  async query(timeSlot : number) {

  
    return new Promise<number>(resolve => {
      let returnVal: number = 0;

      while (timeSlot > 0) {
        returnVal += this.tree[timeSlot]
        timeSlot -= timeSlot & (-timeSlot)
      }
      resolve(returnVal)
    });


  }


  async rangeQuery(l: number, r : number) {
    let ret : number = await this.query(l - 1) - await this.query(r)
    return ret
  }

  addTimeline(start : number, end : number) {
    //Inside, prefix sum adds 1 because it encounters slot=start
    this.update(start, 1);

    //When going outisde timeline (end+1), one add -1 to remember one dont longer
    //have added +1 when encountered start.
    // Only going to use prefix sum to count number of timelines that I am standing on, so
    // no range query needed
    //
    //--OFF TOPIC---
    //Range query gives then prefix sum to end - prefix sum to start:
    //NB! not needed for this class
    // (rangequery start inside timeline, rangequery end outside timeline): (1+(-1)) - 1 = -1
    // (rangequery start inside timeline, rangequery end inside timeline):  (1+0) - 1 = 0
    // (rangequery start outside timeline, rangequery end outside timeline):  (1+(-1)) - 0 = 0-0 =0
    // (rangequery start outside timeline, rangequery end inside timeline):  (1+0) - 0 = 1-0 =1
    //Because all timelines inside follow same logic, sum becomes 0.
    this.update(end + 1, -1);

  }
  //Do reverse update compared to adding
  removeTimeline(start : number, end : number) {
    this.update(start, -1);
    this.update(end + 1, 1);
  }

  async getCountingList(start: number, stop: number) {
    let res: Array<Promise<number>> = new Array<Promise<number>>();

    for (let i = start; i <= stop; i++) {
      res.push(this.query(i))
    }
     return await Promise.all(res);
  }





}
