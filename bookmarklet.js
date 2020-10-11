javascript: (async () => {
  let body = document
    .getElementsByClassName('autograderResultsContainer--body')
    .item(0);
  if (body == null) {
    const header = document
      .getElementsByClassName('autograderResultsContainer--header')
      .item(0);
    header.querySelector('button').click();
  }
  body = document
    .getElementsByClassName('autograderResultsContainer--body')
    .item(0);

  if (!navigator.userAgent.includes('Firefox')) {
    const tw = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    await new Promise(r => setTimeout(r, 100));
    let curr = tw.nextNode();
    let out = '';
    while (curr) {
      out = `${out}\n${curr.textContent}`;
      curr = tw.nextNode();
    }
    navigator.clipboard.writeText(out);
  } else {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(body);
    selection.removeAllRanges();
    selection.addRange(range);
  }
})();
