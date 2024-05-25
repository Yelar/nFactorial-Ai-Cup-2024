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
                    content: `You will be provided with leetcode problem, and your task will be genrating short hints to solve it. You will return them in html ul form.`
                },
                {
                    role: 'user',
                    content: `Provide a hints for the following LeetCode problem description: ${problemDescription}. It must be in html ul form.`
                }
            ]
        })
    });

    let data = await response.json();

    return data.choices[0].message.content;
}

function displayHint(hint) {
    let li = document.createElement("li");
    li.innerHTML = hint;
    console.log(hint);
    hintList.appendChild(li);
}
