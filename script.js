replaceText(document.body);
var tableRef = $(".datadisplaytable");

//creates new column for ratings
tableRef.find("tbody tr th:nth-child(20)").after("<th class=ddheader scope=col id=rateCol>Rate My Professor</th>");
tableRef.find("tbody tr").each(function (i) {
  if (i > 1) {
    if ($(this).find("td:nth-child(20)").text() !== "TBA") {
      console.log($(this).find("td:nth-child(20)"));
      let name = $.trim($(this).find("td:nth-child(20)").text());
      // name = name.toString();
      // var splitStr = name.split();
      // console.log(name);
      // console.log(splitStr);
      // $(this).css("text-decoration", "line-through");
      let professor = name.replace("  ", " ");
      professor = professor.split(" ");
      if (professor[professor.length - 1] === "(P)") {
        professor.pop();
      }
      console.log(professor);
      let first = professor[0];
      let last = professor[professor.length - 1];
      console.log("first: ", first);
      console.log("last: ", last);

      $(this).find("td:nth-child(20)").after("<td class=dddefault id=rateRow>NRRR</td>");
    } else {
      $(this).find("td:nth-child(20)").after("<td class=dddefault id=rateRow>N/A</td>");
    }
  }

  // crosses out the classes that are closed
  if ($(this).find("td:nth-child(1)").text() === "C") {
    // console.log($(this).find("td:nth-child(1)").text());
    $(this).css("text-decoration", "line-through");
  }
});

function replaceText(element) {
  if (element.hasChildNodes()) {
    element.childNodes.forEach(replaceText);
  } else if (element.nodeType === Text.TEXT_NODE) {
    if (element.textContent.match(/Fall/gi)) {
      const newElement = document.createElement("span");
      newElement.innerHTML = element.textContent.replace(/(Fall)/gi, '<span class="rainbow">$1</span>');
      element.replaceWith(newElement);
    }
  }
}

// tableRef.find("tbody tr td:nth-child(20)").after("<td class=dddefault id=rateRow>NR</td>");
// console.log(tableRef.find("tbody tr th:nth-child(20)"));
