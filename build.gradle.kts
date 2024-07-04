plugins {
    kotlin("multiplatform") version "2.0.0"
    id("maven-publish")
}

group = "org.thundernetwork.permissionchecker"
version = "2.1"

repositories {
    mavenCentral()
}

dependencies {
}

kotlin {
    jvm {}
    js {
        nodejs {
        }
        binaries.executable()
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

tasks {
    val jsProductionExecutableCompileSync by getting
    val jsNodeRun by getting {
        dependsOn(jsProductionExecutableCompileSync)
    }
    val jsNodeDevelopmentRun by getting {
        dependsOn(jsProductionExecutableCompileSync)
    }
    val jsDevelopmentExecutableCompileSync by getting
    val jsNodeProductionRun by getting {
        dependsOn(jsDevelopmentExecutableCompileSync)
    }
}

publishing {
    publications {
        create<MavenPublication>("mavenJava") {
            from(components["kotlin"])
            groupId = project.group.toString()
            artifactId = "permission-checker"
            version = project.version.toString()
        }
    }
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
    dependsOn("jsProductionExecutableCompileSync", "jsPackageJson")
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