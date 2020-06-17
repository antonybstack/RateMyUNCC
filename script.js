var profList = [];
var numOfProf = 0;

function numOfProfessors() {
  console.log("raun");
  // var numOfProf = 1;
  const url = "https://www.ratemyprofessors.com/filter/professor/?&page=1&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=1253";

  chrome.runtime.sendMessage(
    //goes to bg_page.js
    url,
    (data) => (numOfProf = data.searchResultsTotal)
  );
}

numOfProfessors();

async function professorList() {
  let profList = [];
  let numOfPages = numOfProf / 20;
  console.log(numOfProf);
  let i = 1;
  while (i < numOfPages) {
    chrome.runtime.sendMessage(
      //goes to bg_page.js
      "https://www.ratemyprofessors.com/filter/professor/?&page=" + i + "&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=1253",
      (data) => {
        let arr = data.professors;
        arr.forEach((element) => profList.push(element));
        // profList.push(data.professors);
        console.log(profList);
      }
    );
    i += 1;
  }
}

setTimeout(function () {
  professorList();
}, 200);

// console.log("raun");

setTimeout(function () {
  replaceText(document.body);
  var tableRef = $(".datadisplaytable");
  console.log(numOfProf);
  //creates new column for ratings
  tableRef.find("tbody tr th:nth-child(20)").after("<th class=ddheader scope=col id=rateCol>Rate My Professor</th>");
  tableRef.find("tbody tr").each(function (i) {
    if (i > 1) {
      if ($(this).find("td:nth-child(20)").text() !== "TBA") {
        let name = $.trim($(this).find("td:nth-child(20)").text());
        let professor = name.replace("  ", " ");
        professor = professor.split(" ");
        if (professor[professor.length - 1] === "(P)") {
          professor.pop();
        }
        let first = professor[0];
        let last = professor[professor.length - 1];

        $(this)
          .find("td:nth-child(20)")
          .after("<td class=dddefault id=rateRow>" + numOfProf + "</td>");
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
}, 200);

// function run() {
// numOfProfessors();

// console.log(num);
// setTimeout(function () {
//   console.log(num);
// }, 500);
// }

// run();

// function searchProfessor() {}

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
