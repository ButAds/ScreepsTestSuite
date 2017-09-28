class SpawnCreepTestSuite {
    static usesExtentionsInOrder(testMemory) {
        if (Game.spawns.Spawn1.energy <= 10) {
            return TEST_PRECONDITION_FAILED;
        }
        if (!testMemory.extensionUsed) {
            var extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_EXTENSION
                }
            });
            if (extensions.length == 0 || extensions[0].energy < BODYPART_COST[TOUGH]) {
                return TEST_NOT_SETUP_PROPERLY;
            }
            testMemory.extensionUsed = extensions[0].id;
        }
        var extension = Game.getObjectById(testMemory.extensionUsed);
        if (!testMemory.requestedCreep) {
            if (Game.spawns.Spawn1.spawning) {
                return TEST_PRECONDITION_FAILED;
            }

            testMemory.expectedEnergy = extension.energy - BODYPART_COST[TOUGH];

            testMemory.requestedCreep = Game.time + "spanw";
            // We don't care about return codes. We just wanna check next tick if it doesn't exist
            Game.spawns.Spawn1.spawnCreep([TOUGH], testMemory.requestedCreep, {
                energyStructures: [extension, Game.spawns.Spawn1]
            });
            return TEST_NEXT_TICK_CHECK;
        } else {
            if (Game.creeps[testMemory.requestedCreep]) {
                Game.creeps[testMemory.requestedCreep].suicide();
            }
            if (testMemory.expectedEnergy == extension.energy) {
                return TEST_OK;
            }
            console.log("Expected: " + testMemory.expectedEnergy + " got: " + extension.energy);
            return testMemory.expectedEnergy == extension.energy ? TEST_OK : TEST_FAIL;
        }
    }

    static usesOldArchirtectureOnNoStructures(testMemory) {
        if (Game.spawns.Spawn1.energy < 10 && !testMemory.requestedCreep) {
            return TEST_PRECONDITION_FAILED;
        }

        if (testMemory.requestedCreep) {
            return Game.creeps[testMemory.requestedCreep] ? TEST_OK : TEST_FAIL;
        }

        if (Game.spawns.Spawn1.spawning) {
            return TEST_PRECONDITION_FAILED;
        }

        testMemory.requestedCreep = Game.time + "spanw";
        Game.spawns.Spawn1.spawnCreep([TOUGH], testMemory.requestedCreep, {});
        return TEST_NEXT_TICK_CHECK;

    }

    static filtersOutSameBuildingUsedTwice(testMemory) {
        if (Game.spawns.Spawn1.spawning || Game.spawns.Spawn1.energy < 60) {
            return TEST_PRECONDITION_FAILED;
        }
        if (Game.spawns.Spawn1.energy < 50 && !testMemory.requestedCreep) {
            return TEST_NEXT_TICK_CHECK;
        }
        if (testMemory.requestedCreep) {
            return Game.creeps[testMemory.requestedCreep] ? TEST_FAIL : TEST_OK;
        } else if (Game.spawns.Spawn1.energy > 100) {

            if (Game.spawns.Spawn1.spawning) {
                return TEST_PRECONDITION_FAILED;
            }
            Game.spawns.Spawn1.spawnCreep([WORK], Game.time + "spawn", {
                energyStructures: [Game.spawns.Spawn1, Game.spawns.Spawn1]
            });
            return TEST_NEXT_TICK_CHECK;
        }
        testMemory.requestedCreep = Game.time + "spanw";
        // We don't care about return codes. We just wanna check next tick if it doesn't exist
        Game.spawns.Spawn1.spawnCreep([WORK], testMemory.requestedCreep, {
            energyStructures: [Game.spawns.Spawn1, Game.spawns.Spawn1]
        });

        return TEST_NEXT_TICK_CHECK;
    }

    static acceptEmptyArrayAsEnergyStructures(testMemory) {
        if (Game.spawns.Spawn1.energy < 10 && !testMemory.requestedCreep) {
            return TEST_PRECONDITION_FAILED;
        }

        if (testMemory.requestedCreep) {
            return Game.creeps[testMemory.requestedCreep] ? TEST_FAIL : TEST_OK;
        }
        if (Game.spawns.Spawn1.spawning) {
            return TEST_PRECONDITION_FAILED;
        }
        testMemory.requestedCreep = Game.time + "spanw";
        Game.spawns.Spawn1.spawnCreep([WORK], testMemory.requestedCreep, {
            energyStructures: []
        });
        return TEST_NEXT_TICK_CHECK;
    }

    static rejectsIdArray(testMemory) {
        if (Game.spawns.Spawn1.energy < 10 && !testMemory.requestedCreep) {
            return TEST_PRECONDITION_FAILED;
        }

        if (testMemory.requestedCreep) {
            return Game.creeps[testMemory.requestedCreep] ? TEST_FAIL : TEST_OK;
        }

        if (Game.spawns.Spawn1.spawning) {
            return TEST_PRECONDITION_FAILED;
        }

        testMemory.requestedCreep = Game.time + "spanw";
        Game.spawns.Spawn1.spawnCreep([TOUGH], testMemory.requestedCreep, {
            energyStructures: [Game.spawns.Spawn1.id]
        });
        return TEST_NEXT_TICK_CHECK;
    }

    static noCrashOnUndefinedValueInArray(testMemory) {
        if (Game.spawns.Spawn1.energy < 10 && !testMemory.requestedCreep) {
            return TEST_PRECONDITION_FAILED;
        }

        if (testMemory.requestedCreep) {
            return Game.creeps[testMemory.requestedCreep] ? TEST_OK : TEST_FAIL;
        }

        if (Game.spawns.Spawn1.spawning) {
            return TEST_PRECONDITION_FAILED;
        }

        testMemory.requestedCreep = Game.time + "spanw";
        Game.spawns.Spawn1.spawnCreep([TOUGH], testMemory.requestedCreep, {
            energyStructures: [undefined, Game.spawns.Spawn1]
        });
        return TEST_NEXT_TICK_CHECK;
    }

    static get tests() {
        return [
            SpawnCreepTestSuite.usesExtentionsInOrder,
            SpawnCreepTestSuite.usesOldArchirtectureOnNoStructures,
            SpawnCreepTestSuite.filtersOutSameBuildingUsedTwice,
            SpawnCreepTestSuite.acceptEmptyArrayAsEnergyStructures,
            SpawnCreepTestSuite.rejectsIdArray,
            SpawnCreepTestSuite.noCrashOnUndefinedValueInArray
        ]
    }
}

module.exports = SpawnCreepTestSuite;