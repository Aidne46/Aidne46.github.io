$(function () {
  // Custom theme to match style of xterm.js logo
  var baseTheme = {
    foreground: '#F8F8F8',
    background: '#2D2E2C',
    selection: '#5DA5D533',
    black: '#1E1E1D',
    brightBlack: '#262625',
    red: '#CE5C5C',
    brightRed: '#FF7272',
    green: '#5BCC5B',
    brightGreen: '#72FF72',
    yellow: '#CCCC5B',
    brightYellow: '#FFFF72',
    blue: '#5D5DD3',
    brightBlue: '#7279FF',
    magenta: '#BC5ED1',
    brightMagenta: '#E572FF',
    cyan: '#5DA5D5',
    brightCyan: '#72F0FF',
    white: '#F8F8F8',
    brightWhite: '#FFFFFF'
  };
  //prompt
  var color = "\x1b[33;1m$ \x1b[0m";
  var commandrunning = false;
  var apprunning = "none"
  var timesrun = 0
  var hash = "759730a97e4373f3a0ee12805db065e3a4a649a5";
  var isBaseTheme = true;
  var off = false;
  var cancel =  false;
  var term = new window.Terminal({
    theme: baseTheme,
    cursorBlink: true,
    cols: 148,
    rows: 47
  });
 term.open(document.querySelector('.demo'));

  // Cancel wheel events from scrolling the page if the terminal has scrollback
  document.querySelector('.xterm').addEventListener('wheel', e => {
    if (term.buffer.active.baseY > 0) {
      e.preventDefault();
    }
  });

  function runFakeTerminal() {
    if (term._initialized) {
      
      return;
    }

    term._initialized = true;
 if (cancel === false){
      textwrite();
    }
    term.prompt = () => {
      term.write('\r\n' + color);
    };


    
    term.writeln('\x1b[31;1mWelcome to the xterm terminal try running help\x1b[0m ');
  
    prompt(term);
    
    function textwrite(){
    term.onData(e => {
      switch (e) {
        case '\u0003': // Ctrl+C
          term.write('^C');
          //prompt(term);
          if (apprunning !== "none" && commandrunning === true){
            apprunning = "none"
            commandrunning= false
            term.prompt()
          }

          break;
        case '\r': // Enter
          
          runCommand(term, command);
       
          command = '';
          break;
          case '\u0011': // Ctrl+C
         
          window.close()

          break;
        case '\u0000':
          term.write('^C');
       
          break;
        case '\u007F': // Backspace (DEL)
          // Do not delete the prompt
          if (term._core.buffer.x > 2) {
            term.write('\b \b');
            if (command.length > 0) {
              command = command.substr(0, command.length - 1);
            }
          }
          break;
        default: // Print all other characters for demo
          if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
            if (cancel === false){command += e; term.write(e); if(apprunning=="on"){ term.write("\b*")} }
              

          }
      }
    });}
  }

  function prompt(term) {
    command = '';
    term.write('\r\n' + color);
  }
  function appprompt(term) {
    command = '';
    term.write('\r\n');
  }

  var command = '';


  var commands = {
    help: {
      f: () => {
        term.writeln([
          'Welcome to xterm.js! Try some of the commands below.',
          '',
          ...Object.keys(commands).map(e => `  ${e.padEnd(10)} ${commands[e].description}`)
        ].join('\n\r'));
        prompt(term);
      },
      description: 'Prints this help message',
    },
    ls: {
      f: () => {
        term.writeln(['a', 'bunch', 'of', 'fake', 'files'].join('\r\n'));
        term.prompt(term);
      },
      description: 'Prints a fake directory structure'
    },
    clear: {
      f: () => {
        term.write('\u001Bc' )
        term.write(color);
      },
      description: 'clears screen',
    },
    quit: {
      f: () => {
        window.close()
        term.prompt(term)
      },
      description: 'closes terminal',
    },
    on: {
      f: () =>{
        apprunning="on"
        commandrunning=true;
        if (off === true){
          term.write("Hacks are already on. ")
          apprunning="none"
          commandrunning=false;
          term.prompt(term)
        }
          
        },
      description:'Turns on hacks mode'
    },
    nodata: {
      f: () => {
        cancel = true;
  setTimeout(function(){ term.write("(Game will launch in 4))") }, 1000);
  setTimeout(function(){ term.write("\b \b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b") }, 1001);
	setTimeout(function(){ term.write("(Game will launch in 3))") }, 2000);
	setTimeout(function(){ term.write("\b \b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b") }, 2001);
	setTimeout(function(){ term.write("(Game will launch in 2))") }, 3000);
	setTimeout(function(){ term.write("\b \b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b") }, 3001);
	setTimeout(function(){ term.write("(Game will launch in 1))") }, 4000);
	setTimeout(function(){ term.write("\b \b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b") }, 4001);
	setTimeout(function(){ term.write("(Game will launch in 0))") }, 5000);
	setTimeout(function(){ term.write("\b \b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b") }, 5001);
  setTimeout(function(){ term.prompt(term);}, 5005);
     
        
      },
      description: 'closes terminal',
    
    },
    read: {
      f: () => {
        apprunning="read"
        commandrunning=true;
      },
      description: 'test command'
    },
  };

  var hackcommands = {
   
    hackhelp:{
      f: () =>{
        term.writeln([
          'Welcome to hacks mode! Try some of the commands below.',
          '',
          ...Object.keys(hackcommands).map(e => `  ${e.padEnd(10)} ${hackcommands[e].description}`)
        ].join('\n\r'));
        prompt(term);
      },
      description:"Prints this",
    },
    securemsg:{
      f: () =>{
        alert("itworks");
        term.prompt(term);
      },
      description:"Sends secure message",
    },
    open_proxy: {
      f: () => {
       alert("does nothing for now");
        term.prompt(term);
      },
      description: 'opens proxy'
    },
    off: {
      f: () =>{
        if (off === true){
            off = false;
            term.write("Hacks off");
          }
        term.prompt(term);
      },
        description:'Turns hacks off',
    },
    ssh: {
      f: () =>{
        window.open("chrome-extension://pnhechapfaindjhompbnflcldabbghjo/html/nassh.html")
        term.prompt(term);
      },
        description:'Turns hacks off',
    },
  };

  function runCommand(term, text) {
    const command = text.trim().split(' ')[0];


    if (commandrunning===true){
      switch(apprunning){
        case "read":
          alert(command)
          alert(command.length)
          commandrunning= true
         if(command.length===0){
            apprunning="none"
            commandrunning=false;
            term.prompt(term);
            timesrun = 0
            return;
          }
          appprompt(term)
        
            

          
        break;
        command = '';
        command = ""
        case "on":
       
  
        
          pass = command
        //pass = window.prompt("Password")
        pass = SHA1(pass)
        
        if (pass === hash && off === false){
        off=true
        term.write("\n\rHacks on, try running hackhelp")
        apprunning="none"
        commandrunning=false;

        }
        if (pass !== hash){
          term.write("\n\rWrong Password.")
          apprunning="none"
          commandrunning=false;
        }
        term.prompt(term)
        break;
       }
  
      return;
    }    
    if (command.length > 0) {
      term.writeln('');
      
     
      if (commandrunning===false){  
      if (command in commands) {
        commands[command].f();
        return;
      }
      if (command in hackcommands && off === true) {
        hackcommands[command].f();
        return;
      }          
      term.writeln(`${command}: command not found or not implemented`);
      }
      
    }
    if (commandrunning===false){
    prompt(term);}
  }

  runFakeTerminal();

}); 

