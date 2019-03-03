
export default class Component {

  _data: any;

  constructor(data?: any) {
    this._data = data;
  }

  serialize(): string {
    return '';
  }

}