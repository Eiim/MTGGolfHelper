# MTGGolfHelper
A simple helper application for finding Scryfall golfs

## What is Scryfall/MtG Golf?
Scryfall golf is similar to other "golfing", like code golfing or regex golfing, in that its goal is to find the shortest search to match two particular Magic: The Gathering cards, typically on Scryfall.
For more information, see https://twitter.com/ScryfallGolf (unaffiliated)

## What does this do?
This finds unusual common substrings in the text of two Magic cards. Magic cards have particular ways things are worded, and so using general English frequency estimates will give substandard results.

## How do I use it?
For the moment, download/clone the repository and run mtgCardSimilarities.js with Node, or mtgCardSimilarNonmatches.js for common missing substrings. I hope to have a better UI in place in the near future.

## Help, it's broken!
If you're seeing strange `[36;` strings that make the output hard to read, your terminal doesn't support colored output. For the moment there's no way to disable this, so I would suggest upgrading your terminal. If you're on Windows, [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701) is a fantastic alternative to Command Prompt. If you're on Linux, I'm sure you know plenty about your different options already. If you're on Mac, I'm sorry that you're using a Mac.

## How do I update the substring frequencies?
Substring frequencies shouldn't need to be updated more than once every few years, as by this point they're unlikely to change much unless there are significant rewordings throughout the oracle text, but if you need to, download the "Default Cards" export from [Scryfall](https://scryfall.com/docs/api/bulk-data) and run mtgCardAgglutinator.js. You'll need to edit the Agglutinator file to point to the export. If it's been a while since the cards have updated, feel free to open a pull request with your update.