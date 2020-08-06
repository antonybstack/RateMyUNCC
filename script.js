//fetches number of professors available to fetch from api
function numOfProfessors() {
  console.log(`Getting professor count ...`);
  const url = "https://tonysgrotto.herokuapp.com/api/professors";
  //goes to bg_page.js
  chrome.runtime.sendMessage(url, (data) => {
    numOfProf = data.length;
    console.log(numOfProf + " professors total in database");
  });
}

//fetches professor data from api
function getProfessors() {
  console.log(`Fetching professors data ...`);
  const url = "https://tonysgrotto.herokuapp.com/api/professors";
  //goes to bg_page.js
  chrome.runtime.sendMessage(url, (data) => {
    console.log(data.length);
    for (var i = 0; i < data.length; i++) {
      profList.push(data[i]);
    }
  });
}

function searchName(nameArray, professorArray) {
  let hyphenLast1;
  let hyphenLast2;
  let combinedFirstMiddle;
  let combinedMiddleLast;
  console.log(nameArray);
  nameArray[0] = nameArray[0].toLowerCase();
  nameArray[1] = nameArray[1].toLowerCase();
  if (nameArray[2]) {
    nameArray[2] = nameArray[2].toLowerCase();
  }
  console.log(nameArray);
  if (nameArray !== undefined && nameArray.length > 2) {
    hyphenLast1 = nameArray[nameArray.length - 2].concat("- ", nameArray[nameArray.length - 1]);
    hyphenLast2 = nameArray[nameArray.length - 2].concat("-", nameArray[nameArray.length - 1]);
    combinedMiddleLast = nameArray[nameArray.length - 2].concat(" ", nameArray[nameArray.length - 1]);
    combinedFirstMiddle = nameArray[0].concat(" ", nameArray[1]);
  }

  for (var i = 0; i < professorArray.length; i++) {
    if (professorArray[i].tFname === undefined || professorArray[i].tLname === undefined) {
      console.log("oops!");
    }
    if (professorArray[i].tFname.toLowerCase() === nameArray[0] && professorArray[i].tLname.toLowerCase() === nameArray[nameArray.length - 1]) {
      console.log(professorArray[i]);
      return professorArray[i];
    }
    if (professorArray[i].tFname.toLowerCase() === nameArray[1] && professorArray[i].tLname.toLowerCase() === nameArray[nameArray.length - 1]) {
      console.log(professorArray[i]);
      return professorArray[i];
    } else if (professorArray[i].tFname.toLowerCase() === nameArray[0] && professorArray[i].tLname.toLowerCase() === hyphenLast1) {
      console.log(professorArray[i]);
      return professorArray[i];
    } else if (professorArray[i].tFname.toLowerCase() === nameArray[0] && professorArray[i].tLname.toLowerCase() === hyphenLast2) {
      console.log(professorArray[i]);
      return professorArray[i];
    } else if (professorArray[i].tFname.toLowerCase() === nameArray[0] && professorArray[i].tLname.toLowerCase() === combinedMiddleLast) {
      console.log(professorArray[i]);
      return professorArray[i];
    } else if (professorArray[i].tFname.toLowerCase() === combinedFirstMiddle && professorArray[i].tLname.toLowerCase() === nameArray[nameArray.length - 1]) {
      console.log(professorArray[i]);
      return professorArray[i];
    } else if (professorArray[i].tFname.toLowerCase() === nameArray[0].concat(" ") && professorArray[i].tLname.toLowerCase() === nameArray[nameArray.length - 1]) {
      console.log(professorArray[i]);
      return professorArray[i];
    }
  }
}

function displayPlaceHolders() {
  var gifURL = chrome.extension.getURL("spinner1.gif");
  var tableRef = $(".datadisplaytable");
  tableRef.find("tbody tr th:nth-child(20)").after("<th class=ddheader scope=col style='padding-right:5px !important;' id=rateCol>Rating </th>");
  tableRef.find("tbody tr").each(function (i) {
    var placement = 20;
    var level = "dne";
    if ($(this).find("td:nth-child(9)").text() === "TBA") {
      placement = 19;
    }
    if (i > 1) {
      $(this)
        .find("td:nth-child(" + placement + ")")
        .after("<td class='dddefault rmp' id=na><img src=" + gifURL + " width='18px'></td>");
    }
    //style='padding:12px !important;'
    // crosses out the classes that are closed
    if ($(this).find("td:nth-child(1)").text() === "C") {
      $(this).css("text-decoration", "line-through");
    }
  });
}
displayPlaceHolders();

function run() {
  $(".dddefault.rmp").remove();
  var tableRef = $(".datadisplaytable");
  tableRef.find("tbody tr").each(function (i) {
    var placement = 20;
    var level = "dne";
    if ($(this).find("td:nth-child(9)").text() === "TBA") {
      placement = 19;
    }
    if (i > 1) {
      if (
        $(this)
          .find("td:nth-child(" + placement + ")")
          .text() !== "TBA"
      ) {
        let name = $.trim(
          $(this)
            .find("td:nth-child(" + placement + ")")
            .text()
        );
        let professor = name.replace("  ", " ");
        professor = professor.replace("'", "");
        professor = professor.split(" ");
        if (professor[professor.length - 1] === "(P)") {
          professor.pop();
        }
        professor = professor.filter(function (element) {
          return element !== "";
        });

        if (professor.length > 4) {
          professor.splice(1, professor.length - 2);
        }

        //last name has hyphen
        if (professor[professor.length - 1].includes("-")) {
          console.log(professor);
          let temp = professor.pop();
          let tempArr = [];
          tempArr = temp.split("-");
          tempArr.forEach((element) => professor.push(element));
          if (professor.length === 4) {
            professor.splice(1, 1);
          }
        }
        //first name has hyphen
        if (professor[0].includes("-")) {
          if (professor.length === 2) {
            let tempLast = professor.pop();
            let tempFirst = professor.pop();
            let tempArr = [];
            tempArr = tempFirst.split("-");
            tempArr.forEach((element) => professor.push(element));
            professor.push(tempLast);
            professor.splice(1, 1);
          } else if (professor.length === 3) {
            let tempLast = professor.pop();
            let tempMiddle = professor.pop();
            let tempFirst = professor.pop();
            let tempArr = [];
            tempArr = tempFirst.split("-");
            tempArr.forEach((element) => professor.push(element));
            professor.push(tempMiddle.replace(" ", "").trim());
            professor.push(tempLast.trim());
            professor.splice(2, 1);
          }
        }

        let firstName = professor[0];
        let lastName = professor[professor.length - 1];

        let rating;
        let id;
        let professorProfile = searchName(professor, profList);
        if (professorProfile !== undefined) {
          rating = professorProfile.overall_rating;
          id = professorProfile.tid;
        }
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
          let newRating;
          if (Number.isInteger(rating)) {
            newRating = rating + ".0";
          } else {
            newRating = rating.toString();
          }
          $(this)
            .find("td:nth-child(" + placement + ")")
            .after(
              "<td class=dddefault id=" + level + "><a class=rmpLink style='color:white !important;' href=https://www.ratemyprofessors.com/ShowRatings.jsp?tid=" + id + ">" + newRating + "</a></td>"
            );
        } else {
          $(this)
            .find("td:nth-child(" + placement + ")")
            .after(
              "<td class=dddefault id=" +
                level +
                "><a class=rmpLink style='color:white !important;' href=https://www.ratemyprofessors.com/search.jsp?query=" +
                firstName +
                "+" +
                lastName +
                ">search</a></td>"
            );
        }
      } else {
        $(this)
          .find("td:nth-child(" + placement + ")")
          .after("<td class=dddefault id=na>N/A</td>");
      }
    }
  });
}

//checks if professor data was fetched from api
function checkIfProfessorDatabaseLoaded() {
  if (profList.length == numOfProf && profList.length != 0 && numOfProf != 0) {
    return true;
  } else {
    console.log("Professor Database not loaded");
    return false;
  }
}

function checkIfOnCourseSection() {
  if (document.body.contains(document.getElementsByClassName("captiontext")[0])) {
    return true;
  } else {
    console.log("Not on course section page");
    return false;
  }
}

var profList = [];
var numOfProf = 0;

function fetchProfessorData(callback) {
  numOfProfessors();
  callback();
}

var interval1 = setInterval(function () {
  if (checkIfOnCourseSection() === true) {
    fetchProfessorData(getProfessors);
    clearInterval(interval1);
    var interval2 = setInterval(function () {
      if (checkIfProfessorDatabaseLoaded() === true) {
        run();

        clearInterval(interval2);
      }
    }, 50);
  }
}, 50);

//intervals every 50ms to check if the professor data was fetched AND if "Section Found" element is present, run() executes
// var interval1 = setInterval(function () {
//   if (document.body.contains(document.getElementsByClassName("captiontext")[0])) {
//     if (checkIfProfessorDatabaseLoaded() === true && checkIfOnCourseSection === true) {
//       run();
//     }
//   }
// }, 50);

//clears check interval so it doesnt continously re run after it displays it for the first time
// var interval3 = setInterval(function () {
//   $(".dddefault.rmp").remove();
// }, 50);
