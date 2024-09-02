plugins {
    kotlin("multiplatform") version "2.0.20"
    id("maven-publish")
    id("signing")
}

group = "org.thundernetwork.permissionchecker"
version = "3.0.1"

repositories {
    maven("https://repository.thundernetwork.org/repository/maven-central/")
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

        compilations["main"].packageJson {
            customField("types", "kotlin/${project.name}.d.ts")
        }
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
    dependsOn("kotlinUpgradeYarnLock", "jsNodeProductionLibraryDistribution", "jsPackageJson")
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

//rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin> {
//    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false
//    // "true" for default behavior
//}
//
//rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
//    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false
//    // "true" for default behavior
//}