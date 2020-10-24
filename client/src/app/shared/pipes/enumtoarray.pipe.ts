import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {

  // If find big letter adds space before it
  transform(value): object {
    return Object.keys(value).filter(e => !isNaN(+e)).map(o => {
      let itemName = value[o];
      for (let index = 0; index < itemName.length; index++) {
        const element = itemName[index];
        if (index > 0 && element === element.toUpperCase()) {
          itemName = [itemName.slice(0, index), ' ', itemName.slice(index)].join('');
          index++;
        }
      }
      return {index: +o, name: itemName};
    });
  }

}
