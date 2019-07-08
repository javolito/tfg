export class Product {

  constructor(public price: any,
              public amount: any,
              public total: any,
              public totalProduct: any,
              public name: String,
              public id: String,
              public image: String,
              public type: any,
              public sodaList: Product[],
              public sodaAmount: number[]) {
  }


  addProduct(){
    this.amount++;
    this.totalProduct = this.amount * this.price;
    this.total += this.amount * this.price;
  }

  decreaseProduct(){
    if(this.amount > 0){
      this.amount--;
      this.totalProduct = this.amount * this.price;
    }
  }

  getPrice(){
    return this.price;
  }

  getAmount(){
    return this.amount;
  }

  getTotal(){
    return this.total;
  }

  getTotalProduct(){
    return this.totalProduct;
  }

  getName(){
    return this.name;
  }

  getType(){
    return this.type;
  }

  getSodaList(){
    return this.sodaList;
  }


  addSoda(drink: Product){
    this.sodaList.push(drink)
    var list = this.getOcurrences();


    const index = list.indexOf(drink);
    if(this.sodaAmount[index] > 0){
      this.sodaAmount[index]++;
    }else{
      this.sodaAmount[index] = 1;
    }
  }

  getOcurrences() {
    let occurrences = this.sodaList.slice();
    for (let i = 0; i < occurrences.length; i++){
      while (occurrences.lastIndexOf(occurrences[i]) > occurrences.indexOf(occurrences[i])){
        occurrences.splice(occurrences.lastIndexOf(occurrences[i]),1);
      }
    }

    return occurrences;
  }

  decreaseSoda(drink: Product) {
    var list = this.getOcurrences();
    const index = list.indexOf(drink);
    if(this.sodaAmount[index] > 1){
      this.sodaAmount[index]--;
    }else{
      this.sodaAmount.splice(index, 1);
    }
    this.sodaList.splice(this.sodaList.lastIndexOf(drink), 1)

  }
}
