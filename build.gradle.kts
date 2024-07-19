plugins {
    kotlin("multiplatform") version "2.0.0"
    id("maven-publish")
    id("signing")
    id("org.jetbrains.dokka") version "1.9.20"
}

group = "org.thundernetwork.permissionchecker"
version = "3.0.0"

repositories {
    mavenCentral()
}

dependencies {
}

kotlin {
    jvm {
        withSourcesJar()
    }
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

    js {
        compilations["main"].packageJson {
            customField("homepage", "https://github.com/ThunderNetworkRaD/permission-checker")
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

publishing {
    repositories {
//        maven {
//            name = "OSSRH"
//            url = uri("https://oss.sonatype.org/service/local/staging/deploy/maven2/")
//            credentials {
//                username = System.getenv("OSSRH_USERNAME")
//                password = System.getenv("OSSRH_PASSWORD")
//            }
//        }
        maven {
            name = "GitHub"
            url = uri("https://maven.pkg.github.com/ThunderNetworkRaD/permission-checker")
            credentials {
                username = System.getenv("GITHUB_ACTOR")
                password = System.getenv("GITHUB_TOKEN")
            }
        }
    }
}