let keyrequest = new XMLHttpRequest();
let key = null;
let wordcheck = null;
let word = "";
let check = 0;

/*
I created this initial call to be able to dynamically generate api keys.
The initial problem I was having was due to the fact that my api keys were expiring every few hours so we would lose access.
*/
keyrequest.open("GET", "https://cors-anywhere.herokuapp.com/https://random-word-api.herokuapp.com/key?", true);

keyrequest.onload = function()
{
	key = keyrequest.response;
	console.log(key);
}

keyrequest.send();

/*
I put this in a setTimeout of 2 seconds because we needed our script to wait until our api key has been created.
We want to make sure our user is not trying to add words before our key has been created.
*/
function getword()
{
	setTimeout(function (){
		if(key != null)
		{
			let request = new XMLHttpRequest();
			let data = null;

			request.open("GET", "https://random-word-api.herokuapp.com/word?key=" + key + "&number=1", true); 
			request.onload = function()
			{
				console.log(request)
				console.log(request.status);	

				if(request.status == 200)
				{
					data = JSON.parse(this.response); 
					//console.log(data);
					word = data.toString();
					//console.log(word);
					if(word != null) // we need to make sure our second request is not called before word is defined.
					{
						getWordDef();
					}
				}

			}

			request.send();
		}
	}, 2000);

}

/*
Accessing our second api to take a randomly generated word and get info about it.
*/
function getWordDef() 
{

	let request = new XMLHttpRequest();
	request.open("GET", "https://wordsapiv1.p.rapidapi.com/words/" + word, true);
	request.setRequestHeader("x-rapidapi-host", "wordsapiv1.p.rapidapi.com");
	request.setRequestHeader("x-rapidapi-key", "34fe484d89msh74875f0791949abp11a336jsndf37067ee62e"); // api access 2. Were using the randomly generated word from our first api request.
	


	request.onload = function()
	{
		console.log(request);
		console.log(request.status);		
		if(request.status == 200)
		{
			try //I needed to add some error handling for cases where some words didnt have pronunciations/syllables
			{			
			wordcheck = JSON.parse(this.response); 
			/*
			console.log(wordcheck);
			console.log(wordcheck.results[0]);
			console.log(wordcheck.pronunciation.all);
			console.log(wordcheck.syllables.list);
			*/
			let wordrow = document.createElement("tr");
			let wordname = document.createTextNode(word);

			let worddatadef = document.createElement("td");
			let worddefinition = document.createTextNode(wordcheck.results[0].definition);

			let worddatapro = document.createElement("td");
			let wordpronunciation = document.createTextNode(wordcheck.pronunciation.all);

			let worddatasylla = document.createElement("td");
			let wordsyllables = document.createTextNode(wordcheck.syllables.list);

			let checkbox = document.createElement("INPUT");
			checkbox.type = "checkbox";
			checkbox.setAttribute("id", check);
			check++;

			let wordoption = document.createElement("option");
			let wordinfo = document.createTextNode(word);

			wordoption.appendChild(wordinfo);
			document.querySelector("#wordlist").appendChild(wordoption);

			worddatadef.appendChild(worddefinition);
			worddatapro.appendChild(wordpronunciation);
			worddatasylla.appendChild(wordsyllables);

			document.querySelector("#tablelist").appendChild(wordrow);

			wordrow.appendChild(wordname);
			wordrow.appendChild(worddatadef);
			wordrow.appendChild(wordpronunciation);
			wordrow.appendChild(worddatasylla);
			wordrow.appendChild(checkbox);
			}

			catch(e) 
			{
				alert("Sorry. We could not find a definition for that word. Try another.")
				console.log(e);
			}
		}

	}

	request.send();	
}

function sayHello()
{
	let username = document.querySelector("#username").value;
	let welcomecheck = document.querySelector("#welcomemsg");
	
	if (welcomecheck.firstChild != null) { //added to make sure we do not generate two welcome messages
		welcomecheck.removeChild(welcomecheck.firstChild);
	}

	console.log(welcomecheck);
	console.log(username);
	let welcomenode = document.createElement("p");
	let welcomemsg = document.createTextNode("Hello, " + username + 
		"! This is a application that leverages two apis to retrieve a random word and get information about that word!" +
		" It may take a little while to load each word. Some random words may not generate a definition. " + " You can also use the 'Select Word' dropbox to retrieve another definition of a word. " +
		 "You have the option to enter your own word or you can click the 'Add Random Word' button to get a random word!")
	welcomenode.appendChild(welcomemsg);

	document.querySelector("#welcomemsg").appendChild(welcomenode);

}

function addWord()
{
	getword();
}


//I also thought it would be a nice feature to allow the user to choose their own words.
function addUserWord()
{
	let userword = document.querySelector("#userword").value;
	word = userword
	getWordDef();

}

function addFavoriteWord()
{
	let table = document.querySelector("#tablelist");
	for(let i = 0; i < check; i++)
	{
		if(document.getElementById(i).checked == true)
		{
			console.log(table.rows[i+2]); 
			table.rows[i+2].style.backgroundColor = "green";
		}
	}
}

function moreInfo()
{
	let first = document.querySelector("#morewordinfo");

	if(first.firstChild != null) 
	{
		first.removeChild(first.firstChild);
	}	

	let e = document.querySelector("#wordlist");
	var text = e.options[e.selectedIndex].text;

	let request = new XMLHttpRequest();
	request.open("GET", "https://wordsapiv1.p.rapidapi.com/words/" + text, true);
	request.setRequestHeader("x-rapidapi-host", "wordsapiv1.p.rapidapi.com");
	request.setRequestHeader("x-rapidapi-key", "34fe484d89msh74875f0791949abp11a336jsndf37067ee62e");



	request.onload = function()
	{
		try 
		{
			console.log(request);
			console.log(request.status);
			if(request.status == 200)
			{
				wordcheck = JSON.parse(this.response); 			
				console.log(wordcheck);
				//console.log(text);
				let wordp = document.createElement("p");
				let wordmoredescription = document.createTextNode(wordcheck.results[1].definition);
				wordp.appendChild(wordmoredescription);
				document.querySelector("#morewordinfo").appendChild(wordp);
			}
		} 
		catch(e) 
		{
			console.log(e);
			alert("Sorry. We could not find another definition for that word. Try another.")

		}	
	}
	request.send();
}