

function EmployeeDayEmotion(empId, date, inTimeEmotion, outTimeEmotion, overallDayEmotion, numberOfTimesAPersonAppeared, emotionAPersonMadeMost) {
    this.empId = empId;
    this.date = date;
    this.inTimeEmotion = inTimeEmotion;
    this.outTimeEmotion = outTimeEmotion;
    this.overallDayEmotion = overallDayEmotion;
    this.numberOfTimesAPersonAppeared = numberOfTimesAPersonAppeared;
    this.emotionAPersonMadeMost = emotionAPersonMadeMost;
}

EmployeeDayEmotion.prototype.setEmpId = function(empId) {
    this.empId = empId;
}

EmployeeDayEmotion.prototype.setDate = function(date) {
    this.date = date;
}

EmployeeDayEmotion.prototype.setInTimeEmotion = function(inTimeEmotion) {
    this.inTimeEmotion = inTimeEmotion;
}

EmployeeDayEmotion.prototype.setOutTimeEmotion = function(outTimeEmotion) {
    this.outTimeEmotion = outTimeEmotion;
}

EmployeeDayEmotion.prototype.setOverallDayEmotion = function(overallDayEmotion) {
    this.overallDayEmotion = overallDayEmotion;
}

EmployeeDayEmotion.prototype.setNumberOfTimesAPersonAppeared = function(numberOfTimesAPersonAppeared) {
    this.numberOfTimesAPersonAppeared = numberOfTimesAPersonAppeared;
}
EmployeeDayEmotion.prototype.setEmotionAPersonMadeMost = function(emotionAPersonMadeMost) {
    this.emotionAPersonMadeMost = emotionAPersonMadeMost;
}

// Getters
EmployeeDayEmotion.prototype.getInTimeEmotion = function() {
    return this.inTimeEmotion;
}
EmployeeDayEmotion.prototype.getOutTimeEmotion = function() {
    return this.outTimeEmotion;
}

module.exports = EmployeeDayEmotion;