javascript: (() => {
    const tw = document.createTreeWalker(
        document
            .getElementsByClassName('autograderResultsContainer--body')
            .item(0),
        NodeFilter.SHOW_TEXT,
    );
    let curr = tw.nextNode();
    let out = '';
    while (curr) {
        out = `${out}\n${curr.textContent}`;
        curr = tw.nextNode();
    }
    navigator.clipboard.writeText(out);
})();
