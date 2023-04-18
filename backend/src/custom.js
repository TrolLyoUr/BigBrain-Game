/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  console.log('See question: ', question);
  const newAnswers = question.answers.map(answer => {
    const { correct, ...rest } = answer;
    return rest;
  });
  return {
    id: question.id,
    points: question.points,
    text: question.text,
    time: question.time,
    type: question.type,
    answers: newAnswers,
    mediaUrl: question.mediaUrl,
  };
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  const singleAnswersId = question.answers.filter(answer => answer.correct).map(answer => answer.id);
  return singleAnswersId; // For a single answer
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  const multiAnswersId = question.answers.filter(answer => answer.correct).map(answer => answer.id);
  return multiAnswersId; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.time;
};
