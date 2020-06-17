var profList = [];
var numOfProf = 0;

function numOfProfessors() {
  const url = "https://www.ratemyprofessors.com/filter/professor/?&page=1&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=1253";
  //goes to bg_page.js
  chrome.runtime.sendMessage(url, (data) => (numOfProf = data.searchResultsTotal));
}

numOfProfessors();

function searchName(nameArray, professorArray) {
  let hyphenLast = nameArray[nameArray.length - 2].concat("- ", nameArray[nameArray.length - 1]);
  let hyphenFirst = nameArray[nameArray.length - 2].concat("- ", nameArray[nameArray.length - 1]);
  for (var i = 0; i < professorArray.length; i++) {
    if (
      professorArray[i].tFname.toLowerCase() === nameArray[0].toLowerCase() &&
      professorArray[i].tLname.toLowerCase() === nameArray[nameArray.length - 1].toLowerCase() &&
      professorArray[i].tNumRatings > 0
    ) {
      return professorArray[i];
    } else if (professorArray[i].tFname.toLowerCase() === nameArray[0].toLowerCase() && professorArray[i].tLname.toLowerCase() === hyphenLast.toLowerCase()) {
      return professorArray[i];
    } else if (professorArray[i].tFname.toLowerCase() === nameArray[0].concat(" ").toLowerCase() && professorArray[i].tLname.toLowerCase() === nameArray[nameArray.length - 1].toLowerCase()) {
      return professorArray[i];
    }
  }
}

async function professorList() {
  let numOfPages = numOfProf / 20;
  let i = 1;
  while (i < numOfPages) {
    //goes to bg_page.js
    chrome.runtime.sendMessage(
      "https://www.ratemyprofessors.com/filter/professor/?&page=" + i + "&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=1253",
      (data) => {
        let arr = data.professors;
        arr.forEach((element) => profList.push(element));
      }
    );
    i += 1;
  }
}

setTimeout(function () {
  professorList();
}, 500);

function run() {
  var tableRef = $(".datadisplaytable");
  tableRef.find("tbody tr th:nth-child(20)").after("<th class=ddheader scope=col id=rateCol>Rating</th>");
  tableRef.find("tbody tr").each(function (i) {
    if (i > 1) {
      if ($(this).find("td:nth-child(20)").text() !== "TBA") {
        let name = $.trim($(this).find("td:nth-child(20)").text());
        let professor = name.replace("  ", " ");
        professor = professor.split(" ");
        if (professor[professor.length - 1] === "(P)") {
          professor.pop();
        }
        if (professor[professor.length - 1].includes("-")) {
          let temp = professor.pop();
          let tempArr = [];
          tempArr = temp.split("-");
          tempArr.forEach((element) => professor.push(element));
          professor.splice(1, 1);
        }
        let rating;
        let id;
        let professorProfile = searchName(professor, profList);
        if (professorProfile !== undefined) {
          rating = professorProfile.overall_rating;
          id = professorProfile.tid;
        }
        let level;
        switch (true) {
          case rating >= 4:
            level = "great";
            break;
          case rating >= 3:
            level = "good";
            break;
          case rating >= 2:
            level = "okay";
            break;
          case rating >= 1:
            level = "bad";
            break;
          case rating < 1:
            level = "awful";
            break;
          default:
            level = "dne";
            break;
        }
        if (rating !== undefined) {
          $(this)
            .find("td:nth-child(20)")
            .after(
              "<td class=dddefault id=" + level + "><a class=rmpLink style='color:white !important;' href=https://www.ratemyprofessors.com/ShowRatings.jsp?tid=" + id + ">" + rating + "</a></td>"
            );
        } else {
          $(this)
            .find("td:nth-child(20)")
            .after("<td class=dddefault id=" + level + ">DNE</td>");
        }
      } else {
        $(this).find("td:nth-child(20)").after("<td class=dddefault id=rateRow>N/A</td>");
      }
    }
    // crosses out the classes that are closed
    if ($(this).find("td:nth-child(1)").text() === "C") {
      $(this).css("text-decoration", "line-through");
    }
  });
}

//checks if professor list is loaded
function checkVariable() {
  console.log(profList);
  if (profList.length > 2979) {
    console.log(profList);
    return true;
  } else {
    return false;
  }
}

//intervals every 50ms to check if the profile is loaded, if it is, run() executes
var interval1 = setInterval(function () {
  if (checkVariable() === true) {
    run();
  }
}, 50);

var interval2 = setInterval(function () {
  console.log("hello");
  if (checkVariable() === true) {
    clearInterval(interval1);
    clearInterval(interval2);
  }
}, 50);
