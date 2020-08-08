# Branfrick
An extension to Brainfuck to make it atleast a little more useful

# Additions
$ - Returns head to the 1st cell
```
>>>$ //Moves head 3 to the right then returns it to the 1st cell
```

= - Compares current cell to following cell then outputs a 0 or 1 to the next cell
```
+>++<= //Sets first cell to 1 and 2nd cell to 2, 3rd cell will be a 0
```

letter{} - Defines a function, functions must be defined with one letter, case sensitive and must be defined before it is used
```
a{>+++} //Defines a function a that moves right and adds 3
```

letter@ - Calls function with that name
```
a{>+++} //Defines function
a@ //Calls function
```

^ - Repeats the next command a number of times based on the current cells value
```
+++^> //Adds 3 to cell then moves right 3 (value of cell)
```

Number after command - If it is a valid command, repeats it that many times
```
+5 //Adds 5 to current cell
```

// - Denotes rest of a line as a comment
```
+++>><<><+ //Comment
```
