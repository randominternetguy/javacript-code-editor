const textarea = document.querySelector('#main');
const lineNumberRow = document.querySelector('#line-number');
let numberOfSpaces = 0; // double spaces will become tabs

textarea.addEventListener('keydown', (event) => {
  if (event.keyCode == 9) { 
    addTab();
    event.preventDefault(); 
  }
  else if (event.keyCode == 13) {
    incrementLineNumber();
  }
  else if (event.keyCode == 8 && caretAtStartLine()) {
    decrementLineNumber(); 
  }
  else if (event.keyCode == 32) {
    numberOfSpaces++;
    if (numberOfSpaces == 2) {
      let previousCaretPosition = textarea.getCaretPosition();

      // need to remove space before using addtab
      textarea.value = textarea.value.substring(0, textarea.getCaretPosition() - 1) + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
      numberOfSpaces = 0;

      // needs to set caret position before using addtab
      textarea.setCaretPosition(previousCaretPosition - 1);

      addTab();
      event.preventDefault();
    }
  }
  else {
    numberOfSpaces = 0;
  }
});

function incrementLineNumber(){
  let lineNumber = document.createElement('p');
  lineNumber.textContent = textarea.lineCount() + 1; // need to add 1. I don't know why ¯\_(ツ)_/¯
  lineNumberRow.appendChild(lineNumber);
}

function decrementLineNumber(){
  // do not remove the first line
  if (textarea.lineCount() == 1){
    return;
  }

  lineNumberRow.removeChild(lineNumberRow.lastChild);
}

function caretAtStartLine() {
  return textarea.value[textarea.getCaretPosition() - 1] == '\n'; // check if caret is at start of line.
}

HTMLTextAreaElement.prototype.getCaretPosition = function () { //return the caret position of the textarea
  return this.selectionStart;
};
HTMLTextAreaElement.prototype.setCaretPosition = function (position) { //change the caret position of the textarea
  this.selectionStart = position;
  this.selectionEnd = position;
  this.focus();
};
HTMLTextAreaElement.prototype.hasSelection = function () { //if the textarea has selection then return true
  if (this.selectionStart == this.selectionEnd) {
      return false;
  } else {
      return true;
  }
};
HTMLTextAreaElement.prototype.getSelectedText = function () { //return the selection text
  return this.value.substring(this.selectionStart, this.selectionEnd);
};
HTMLTextAreaElement.prototype.setSelection = function (start, end) { //change the selection area of the textarea
  this.selectionStart = start;
  this.selectionEnd = end;
  this.focus();
};

// return all lines as array.
HTMLTextAreaElement.prototype.lines = function() { return this.value.split(/\r*\n/); }
// return number of lines.
HTMLTextAreaElement.prototype.lineCount = function() { return this.lines().length; }


function addTab(){
  let newCaretPosition;
  newCaretPosition = textarea.getCaretPosition() + "\t".length;
  textarea.value = textarea.value.substring(0, textarea.getCaretPosition()) + "\t" + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
  textarea.setCaretPosition(newCaretPosition);
  return false;
}

// emulate the tab function on mobile when tab button is pressed.
const tabButton = document.querySelector('#tab');
tabButton.addEventListener('click', () => {
  addTab();
});

// delete all text
const deleteButton = document.querySelector('#delete-all');
deleteButton.addEventListener('click', () => {
  textarea.value = '';
})

// copy all text
const copyButton = document.querySelector('#copy');
copyButton.addEventListener('click', () => {
  textarea.select();
  textarea.setSelectionRange(0, -1);
  document.execCommand('copy');

  deselect();
});

function deselect(){
  if (window.getSelection) {window.getSelection().removeAllRanges();}
  else if (document.selection) {document.selection.empty();}
}