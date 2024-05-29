inline=1;
let scrapeInfoButton = document.getElementById("scrapeInfo");
let hintList = document.getElementById("hint_list");

scrapeInfoButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({active:true, currentWindow: true});
    
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapeInfoFromPage,
    }, async (results) => {
        if (results && results[0] && results[0].result) {
            let problemDescription = results[0].result.content;
            let hint = await generateHint(problemDescription, "YOUR_API_KEY");
            displayHint(hint);
                const spoilers = document.querySelectorAll('.spoiler');
                spoilers.forEach(spoiler => {
                    
                    spoiler.addEventListener('click', function() {
                        toggleSpoiler(spoiler);
                    });
                });
        }
    });
});


function scrapeInfoFromPage() {
    let metaDescription = document.head.querySelector('meta[name="description"]');
    return metaDescription ? { content: metaDescription.content } : { content: "" };
}
async function generateHint(problemDescription, apiKey) {
    let response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `You will be provided with leetcode problem, and your task will be generating short hints to solve it. You will return them following this rules:
                    1)You return ONLY html code. 2)Hints are organized like this:
                    <div class="spoiler">
    <div class="spoiler-header">
      <span class="arrow down"></span>
      <p>Your hint</p>
    </div>
</div>`

                },
                {
                    role: 'user',
                    content: `Provide a hints for the following LeetCode problem description: ${problemDescription}.`
                }
            ]
        })
    });

    let data = await response.json();
    alert(data.choices[0].message.content);
    return data.choices[0].message.content;
}

function displayHint(hint) {
    let li = document.createElement("div");
    li.className = "container";
    li.innerHTML = hint;
    console.log(hint);
    hintList.appendChild(li);
}
/*
function toggleSpoiler(element) {
    element.classList.toggle('active');
    const arrow = element.querySelector('.arrow');
    if (element.classList.contains('active')) {
      arrow.classList.remove('down');
      arrow.classList.add('up');
    } else {
      arrow.classList.remove('up');
      arrow.classList.add('down');
    }
  }
  */


function toggleSpoiler(element) {
    element.classList.toggle('active');
    const arrow = element.querySelector('.arrow');
    if (element.classList.contains('active')) {
      arrow.classList.remove('down');
      arrow.classList.add('up');
    } else {
      arrow.classList.remove('up');
      arrow.classList.add('down');
    }
}

