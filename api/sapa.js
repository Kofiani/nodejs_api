function mood() {
    let yourMood = prompt('what is your mood');
    if (yourMood.toLowerCase() === "sad"){
        yourMood = prompt('I know why you\'re sad. want to know why? 🙁');
        if (yourMood.toLowerCase() === 'yes'){
            alert("Na Sapa cause am. Sapa Nice One 👏")
        } else { alert("oya get out")
    }
    return;
}}