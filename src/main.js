global.TEST_PENDING = -1;
global.TEST_OK = 9000;
global.TEST_PRECONDITION_FAILED = 1;
global.TEST_FAILURE = 2;
global.TEST_NEXT_TICK_CHECK = 3;
global.TEST_NOT_SETUP_PROPERLY = 4;

global.TEST_RESULT_NAME = {};
TEST_RESULT_NAME[TEST_PENDING] = "Pending";
TEST_RESULT_NAME[TEST_OK] = "<span style='color:green'>OK</span>";
TEST_RESULT_NAME[TEST_PRECONDITION_FAILED] = "Waiting for preconditions";
TEST_RESULT_NAME[TEST_FAILURE] = "<span style='color:red'>FAIL</span>";
TEST_RESULT_NAME[TEST_NOT_SETUP_PROPERLY] = "<span style='color:red;'>Please setup this test</span>";
TEST_RESULT_NAME[TEST_NEXT_TICK_CHECK] = "Next tick results...";

var testClasses = [];
testClasses.push(require("testSuite.spawnCreep"));

module.exports.loop = function() {
	if (!Memory.testData) {
		Memory.testData = {}
	}
	testData = Memory.testData;
	
	var tests = [];
	for (var i = 0; i < testClasses.length; i++) {
		tests = tests.concat(testClasses[i].tests);
	}
	setupTestMemory(testData, tests);
	fireTests(testData, tests);
	printTestReport(testData.test);
}

String.prototype.padRight = function(l, c) {
    return this + Array(l - this.length + 1).join(c || " ")
}

function printTestReport(testData) {
	var widthSize = 0;
	for (var d in testData) {
		if (testData[d].name.length > widthSize) {
			widthSize = testData[d].name.length;
		}
	}
	console.log("Testreport tick ["+Game.time+"]");
	for (var d in testData) {
		console.log("\t" + testData[d].name.padRight(widthSize, ' ') + ' -> \t' + TEST_RESULT_NAME[testData[d].status]);
	}
	console.log("=================== ["+Game.time+"] ===================");
}

function setupTestMemory(testData, tests) {
	if (!testData.test || testData.test.length != tests.length) {
		testData.test = [];
		for (var i = 0; i < tests.length; i++) {
			testData.test[i] = {
				status: TEST_PENDING,
				name: tests[i].name,
				memory: {}
			};
		}
	}
}


function fireTests(testData, tests) {
	for (var i = 0; i < testData.test.length; i++) {
		if (testData.test[i].status === TEST_NEXT_TICK_CHECK) {
			runTest(testData.test[i], tests[i]);
			return;
		}
	}

	for (var i = 0; i < testData.test.length; i++) {
		var testMemory = testData.test[i];
		if (testMemory.status === TEST_PENDING || testMemory.status === TEST_PRECONDITION_FAILED || testMemory.status === TEST_NOT_SETUP_PROPERLY) {
			var result = runTest(testData.test[i], tests[i]);
			if (result != TEST_PRECONDITION_FAILED && result != TEST_NOT_SETUP_PROPERLY) {
				return;
			}
		}
	}
	_.values(Game.creeps).forEach(c => c.suicide());
}

function runTest(testMemory, test) {
	var result = runSafeTest(test, testMemory.memory);
	testMemory.status = result;
	return result;
}

global.runSafeTest = function(method, ...args) {
	try {
		return method.apply(null, args);
	} catch (error) {
		return TEST_FAILURE;
	}
}