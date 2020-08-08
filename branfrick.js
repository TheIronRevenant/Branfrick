var inputButton = document.getElementById('InputButton');
var fileInput = document.getElementById('FileInput');
var inputBox = document.getElementById('CodeInput');
var outputBox = document.getElementById('CodeOutput');
inputBox.onkeydown = function(e) {
    if (e.keyCode == 9 || e.which == 9) {
        e.preventDefault();
        var s = this.selectionStart;
        this.value = this.value.substring(0,this.selectionStart) + "    " + this.value.substring(this.selectionEnd);
        this.selectionEnd = s+1;
    }
}
inputButton.addEventListener('click', () => {
    program.parse(inputBox.value);
    program.execute();
});
fileInput.addEventListener('click', () => {
    let file = document.getElementById('FilePicker');
    let fr = new FileReader();
    fr.onload = function() {
        program.parse(fr.result);
        program.execute();
    }
    fr.readAsText(file.files[0]);
});

window.onbeforeunload = function() {
    localStorage.setItem('CodeData', inputBox.value);
}

window.onload = function() {
    inputBox.value = localStorage.getItem('CodeData');
}

var tape = [ 0 ];
var head = 0;
var functions = {};

class Add {
    static execute() {
        tape[head]++;
        if (tape[head] > 255) {
            tape[head] = 255;
        }
    }
}

class Sub {
    static execute() {
        tape[head]--;
        if (tape[head] < 0) {
            tape[head] = 0;
        }
    }
}

class Right {
    static execute() {
        head++;
        if (head >= tape.length) {
            tape[head] = 0;
        }
    }
}

class Left {
    static execute() {
        head--;
        if (head < 0) {
            head = 0;
        }
    }
}

class Output {
    static execute() {
        outputBox.value += String.fromCharCode(tape[head]);
    }
}

class Input {
    static execute() {
        tape[head] = window.prompt('Enter input', '').charCodeAt(0);
    }
}

class Loop {
    constructor() {
        this.instructions = [];
    }

    addInstruction(instruction) {
        this.instructions.push(instruction);
    }

    execute() {
        while (tape[head] != 0) {
            for (let i = 0; i < this.instructions.length; i++) {
                this.instructions[i].execute();
            }
        }
    }
}

//Branfrick

class Begin {
    static execute() {
        head = 0;
    }
}

class Equals {
    static execute() {
        let c1 = tape[head];
        Right.execute();
        let c2 = tape[head];
        Right.execute();
        if (c1 == c2) {
            tape[head] = 1;
        } else {
            tape[head] = 0;
        }
    }
}

class Function {
    constructor() {
        this.instructions = [];
    }

    addInstruction(instruction) {
        this.instructions.push(instruction);
    }

    execute() {
        for (let i in this.instructions) {
            this.instructions[i].execute();
        }
    }
}

class CompundCurrent {
    constructor() {
        this.instruction;
    }

    setInstruction(instruction) {
        this.instruction = instruction;
    }

    execute() {
        let compound = tape[head];
        for (let i = 0; i < compound; i++) {
            this.instruction.execute();
        }
    }
}

var parseId = 0;
class Program {
    constructor() {
        this.instructions = [];
    }

    addInstruction(instruction) {
        this.instructions.push(instruction);
    }

    execute() {
        outputBox.value = '';

        tape = [ 0 ];
        head = 0;
        for (let i = 0; i < this.instructions.length; i++) {
            this.instructions[i].execute();
        }

        let table = document.getElementById("Tape");
        let tbody = table.children[0];
        let numrow = tbody.children[0];
        let valrow = tbody.children[1];
        
        while (numrow.firstChild) {
            numrow.removeChild(numrow.firstChild);
        }
        while (valrow.firstChild) {
            valrow.removeChild(valrow.firstChild);
        }

        for (let i = 0; i < tape.length; i++) {
            if (i != head) {
                let newnum = document.createElement('td');
                let newval = document.createElement('td');
                newnum.innerText = i;
                newval.innerText = tape[i];
                numrow.appendChild(newnum);
                valrow.appendChild(newval);
            } else {
                let newnum = document.createElement('th');
                let newval = document.createElement('th');
                newnum.innerText = i;
                newval.innerText = tape[i];
                numrow.appendChild(newnum);
                valrow.appendChild(newval);
            }
        }
    }

    parse(code) {
        let lines = code.split('\n');
        let parseCode = '';
        for (let l in lines) {
            let parsedLine = '';
            lines[l] = lines[l].replace(/(\s|\r\n|\r|\n)+/gm, '');
            let s = lines[l].split('//');
            parseCode += s[0];
        }
        console.log(parseCode);

        parseId = 0;
        this.instructions = [];
        functions = {};
        while (parseId < parseCode.length) {
            Parse(this.instructions, parseCode);
            parseId++;
        }
    }
}

function Parse(container, code) {
    let i = 0;
    let repeat = '';
    switch(code[parseId]) {
        //Base brainfuck
        case '+':
            //Branfrick compounding
            while (Number.isInteger(parseInt(code[parseId + i + 1]))) {
                i++;
            }
            for (let j = 0; j < i; j++) {
                repeat += code[parseId + j + 1];
            }
            repeat = parseInt(repeat);

            if (repeat) {
                for (let j = 0; j < repeat; j++) {
                    container.push(Add);
                }
            } else {
                container.push(Add);
            }

            parseId += i;
            break;
        case '-':
            //Branfrick compounding
            while (Number.isInteger(parseInt(code[parseId + i + 1]))) {
                i++;
            }
            for (let j = 0; j < i; j++) {
                repeat += code[parseId + j + 1];
            }
            repeat = parseInt(repeat);

            if (repeat) {
                for (let j = 0; j < repeat; j++) {
                    container.push(Sub);
                }
            } else {
                container.push(Sub);
            }

            parseId += i;
            break;
        case '>':
            //Branfrick compounding
            while (Number.isInteger(parseInt(code[parseId + i + 1]))) {
                i++;
            }
            for (let j = 0; j < i; j++) {
                repeat += code[parseId + j + 1];
            }
            repeat = parseInt(repeat);

            if (repeat) {
                for (let j = 0; j < repeat; j++) {
                    container.push(Right);
                }
            } else {
                container.push(Right);
            }

            parseId += i;
            break;
        case '<':
            //Branfrick compounding
            while (Number.isInteger(parseInt(code[parseId + i + 1]))) {
                i++;
            }
            for (let j = 0; j < i; j++) {
                repeat += code[parseId + j + 1];
            }
            repeat = parseInt(repeat);

            if (repeat) {
                for (let j = 0; j < repeat; j++) {
                    container.push(Left);
                }
            } else {
                container.push(Left);
            }

            parseId += i;
            break;
        case '.':
            //Branfrick compounding
            while (Number.isInteger(parseInt(code[parseId + i + 1]))) {
                i++;
            }
            for (let j = 0; j < i; j++) {
                repeat += code[parseId + j + 1];
            }
            repeat = parseInt(repeat);

            if (repeat) {
                for (let j = 0; j < repeat; j++) {
                    container.push(Output);
                }
            } else {
                container.push(Output);
            }

            parseId += i;
            break;
        case ',':
            //Input does not use compounding because it would be pointless
            container.push(Input);
            break;
        case '[':
            let l = new Loop();
            parseId++;
            while (code[parseId] != ']') {
                Parse(l.instructions, code);
                parseId++;
            }
            container.push(l);
            break;
        //Branfrick
        case '$':
            container.push(Begin);
            break;
        case '=':
            container.push(Equals);
            break;
        case '^':
            let c = new CompundCurrent();
            let next = [];
            parseId++;  
            Parse(next, code);
            c.setInstruction(next[0]);
            container.push(c);
            break;
        default:
            //Functions
            let char = code[parseId].charCodeAt(0);
            let name = code[parseId];
            if ((char >= 65 && char <= 90) || (char >= 97 && char <= 122)) {
                if (code[parseId + 1] == '{') {
                    let f = new Function();
                    parseId += 2;
                    while (code[parseId] != '}') {
                        Parse(f.instructions, code);
                        parseId++;
                    }
                    functions[name] = f;
                } else
                if (code[parseId + 1] == '@') {
                    if (functions[code[parseId]]) {
                        container.push(functions[code[parseId]]);
                    } else {
                        console.log('Function ' + code[parseId] + ' is not defined');
                    }
                }
            }
            break;
    }
}

var program = new Program();