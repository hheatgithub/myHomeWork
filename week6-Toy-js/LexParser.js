const myXregrexp = {
  InputElement: "<Whitespace>|<LineTerminator>|<Comments>|<Token>",
  Whitespace: / /,
  LineTerminator: /\n/,
  Comments: /\/\*(?:[^*]|\*[^\/])*\*\/|\/\/[^\n]*/,
  Token: "<Literal>|<Keywords>|<Identifier>|<Punctuator>",
  Literal: "<NumericalLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>",
  NumericalLiteral: /0x[0-9a-zA-Z]+|0o[0-7]+|0b[01]+|(?:[1-9][0-9]*|0)(?:\.[0-9]*)?|\.[0-9]+/,
  BooleanLiteral: /true| false/,
  StringLiteral: /\"(?:[^"\n]|\\[\s\S])*\"|\'(?:[^'\n]|\\[\s\S])*\'/,
  NullLiteral: /null/,
  Identifier: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
  Keywords: /if|else|for|function|let|var/,
  Punctuator: /\+|\,|\?|\:|\{|\}|\.|\(|\=|\<|\+\+|\=\=|=>|=|\*|\)|\[|\]|;/
};

class XRegExp {
  constructor(source, flag, root = "root") {
    this.table = new Map();
    this.regexp = new RegExp(this.compileRegExp(source, root, 0).source, flag);
  }

  compileRegExp(source, name, start) {
    if (source[name] instanceof RegExp) {
      // console.log(name, " =", source[name].source);
      return { source: source[name].source, length: 0 };
    } else {
      //console.log(name, " =", source[name]);
    }

    let length = 0;
    let regexp = source[name].replace(/\<([^>]+)\>/g, (str, $1) => {
      this.table.set(start + length, $1);
      // this.table.set($1, start+ length);
      ++length;
      let r = this.compileRegExp(source, $1, start + length);
      length += r.length;
      return "(" + r.source + ")";
    });

    return { source: regexp, length: length };
  }
  exec(string) {
    let r = this.regexp.exec(string);
    //console.log("-------\nXRegExp -> exec -> r[0]=", r[0]);
    for (let i = 1; i < r.length; i++) {
      if (r[i] !== void 0) {
        //  console.log(this.table.get(i - 1));
        r[this.table.get(i - 1)] = r[i];
      }
    }

    return r;
  }

  get lastIndex() {
    return this.regexp.lastIndex;
  }

  set lastIndex(value) {
    return (this.regexp.lastIndex = value);
  }
}

export function* scan(str) {
  let regexp = new XRegExp(myXregrexp, "g", "InputElement");

  while (regexp.lastIndex < str.length) {
    let r = regexp.exec(str);

    if (r.Whitespace) {
    } else if (r.LineTerminator) {
    } else if (r.Comments) {
    } else if (r.NumericalLiteral) {
      yield {
        type: "NumericalLiteral",
        value: r[0]
      };
    } else if (r.BooleanLiteral) {
      yield {
        type: "BooleanLiteral",
        value: r[0]
      };
    } else if (r.StringLiteral) {
      yield {
        type: "StringLiteral",
        value: r[0]
      };
    } else if (r.NullLiteral) {
      yield {
        type: "NullLiteral",
        value: null
      };
    } else if (r.Identifier) {
      yield {
        type: "Identifier",
        name: r[0]
      };
    } else if (r.Keywords) {
      yield {
        type: r[0]
      };
    } else if (r.Punctuator) {
      yield {
        type: r[0]
      };
    } else {
      throw new Error("unexpected token" + r[0]);
    }

    if (!r[0].length) {
      break;
    }
  }

  yield { type: "EOF" };
}

const toScan = `
   for(let i=0; i<3;i++){
     for (let j=0; j<3; j++){
       let cell = document.createElement("div");
       cell.classList.add("cell");
       cell.innerText= pattern[i*3 +j] ==2? "X":
         pattern[i*3 +j] ==1 ? "O": "";
         cell.addEventListerner("click", () => userMove(j,i));
         board.appendChild(cell);
         a=4;
     }
     board.appendChild(document.createElement("br"))
   }
  `;
// scan(toScan);

// testing code
// for (let element of scan(toScan)) {
//   console.log(element);
// }
