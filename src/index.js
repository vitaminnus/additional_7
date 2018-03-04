module.exports = function solveSudoku(matrix) {
  let zeros = [];
  function getVariants(array) {
    let result = [];
    for (let i=1; i<=9; i++) {
      if (!array.includes(i)) {
        result.push(i);
      }
    }
    return result;
  }
  let ifOneDeleted = false;
  function deleteVariants(i, j, variants) {
    if (matrix[i][j] === 0) {
      zeros[i][j] = zeros[i][j].filter(elem => variants.includes(elem));
      if (zeros[i][j].length === 1) {
        matrix[i][j] = zeros[i][j][0];
        ifOneDeleted = true;
      }
    }
  }

  function checkZeros(i, j, chastotnost) {
    if (zeros[i][j] !== 0 && matrix[i][j] === 0) {
      let odinochka = zeros[i][j].find(elem => chastotnost[elem-1]===1);
      if (odinochka) {
        matrix[i][j]=odinochka;
        ifOneDeleted = true;
      }
    }
  }
  function getChastotnost(array) {
    const result = [0,0,0,0,0,0,0,0,0];
    array.forEach(elem => {
      if (elem !== 0) {
        elem.forEach(chislo => {
          result[chislo-1]++;
        });
      }
    });
    return result;
  }

  function randomVariant(min) {
    let flag = false;
    for (let i=0; i<9; i++) {
      for (let j=0; j<9; j++) {
        if (matrix[i][j] === 0 && zeros[i][j].length === min) {
          matrix[i][j] = zeros[i][j][1];
          flag = true;
          break;
        }
      }
      if (flag) {
        break;
      }
    }
    return flag;
  }

do {
  let haveAnyZero = false;
  zeros = [];
    matrix.forEach((elem, i) => {
      const variants = getVariants(elem);
      zeros.push([]);
      elem.forEach((el, j) => {
        if (el === 0) {
          zeros[i].push(variants.slice());
          haveAnyZero = true;
        } else {
          zeros[i].push(0);
        }
      })
    });
    ifOneDeleted = false;
    let stolbets = [];
    for (let j=0; j<9; j++){
      stolbets = [];
      for (let i=0; i<9; i++){
        stolbets.push(matrix[i][j]);
      }
      const variants = getVariants(stolbets);
      for (let i=0; i<9; i++){
        deleteVariants(i, j, variants);
      }
    }
    let kvadrat = [];
    for (let n=0; n<3; n++){
      for (let k=0; k<3; k++){
        kvadrat = [];
        for (let i=k*3; i<k*3+3; i++){
          for (let j=n*3; j<n*3+3; j++){
            kvadrat.push(matrix[i][j]);
          }
        }
        const variants = getVariants(kvadrat);
        for (let i=k*3; i<k*3+3; i++){
          for (let j=n*3; j<n*3+3; j++){
            deleteVariants(i, j, variants);
          }
        }
      }
    }

    zeros.forEach((elem, i) => {
      const chastotnost = getChastotnost(elem);
      elem.forEach((el, j) => {
        checkZeros(i, j, chastotnost);
      });
    });
    stolbets = [];
    for (let j=0; j<9; j++){
      stolbets = [];
      for (let i=0; i<9; i++){
        stolbets.push(zeros[i][j]);
      }
      const chastotnost = getChastotnost(stolbets);
      for (let i=0; i<9; i++){
        checkZeros(i, j, chastotnost);
      }
    }
    kvadrat = [];
    for (let n=0; n<3; n++){
      for (let k=0; k<3; k++){
        kvadrat = [];
        for (let i=k*3; i<k*3+3; i++){
          for (let j=n*3; j<n*3+3; j++){
            kvadrat.push(zeros[i][j]);
          }
        }
        const chastotnost = getChastotnost(kvadrat);
        for (let i=k*3; i<k*3+3; i++){
          for (let j=n*3; j<n*3+3; j++){
            checkZeros(i, j, chastotnost);
          }
        }
      }
    }
    if (haveAnyZero && !ifOneDeleted) {
      ifOneDeleted = randomVariant(2);
      if (!ifOneDeleted) {
        ifOneDeleted = randomVariant(3);
      }
    }
  } while (ifOneDeleted === true);
  return matrix;
}

