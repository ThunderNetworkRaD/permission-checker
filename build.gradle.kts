plugins {
    kotlin("multiplatform") version "2.0.0"
    id("maven-publish")
}

group = "org.thundernetwork.permissionchecker"
version = "2.2.1"

repositories {
    mavenCentral()
}

dependencies {
}

kotlin {
    jvm {}
    js (IR) {
        nodejs {}
        binaries.library()
        generateTypeScriptDefinitions()
        useEsModules()
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
            }
        }
        val jvmMain by getting {
            dependencies {
            }
        }
        val jsMain by getting {
            dependencies {
            }
        }
    }
}


publishing {
    // publications {
    //     create<MavenPublication>("mavenJava") {
    //         from(components["kotlin"])
    //         groupId = project.group.toString()
    //         artifactId = "permission-checker"
    //         version = project.version.toString()
    //     }
    // }
    repositories {
        maven {
            url = uri("https://source.thundernetwork.org/api/packages/ThunderNetworkRaD/maven") // Replace with your Maven repository URL
            credentials {
                username = ""
                password = ""
            }
        }
    }
}

tasks.register<Copy>("prepareNpmPublication") {
    dependsOn("jsNodeProductionLibraryDistribution", "jsPackageJson")
    from("build/js/packages/${project.name}", "README.md")
    into("build/npm")
}

tasks.register("publishToNpm") {
    dependsOn("prepareNpmPublication")
    doLast {
        exec {
            workingDir("build/npm")
            commandLine("npm", "publish")
        }
    }
}