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

tasks.register<Jar>("dokkaHtmlJar") {
    dependsOn(tasks.dokkaHtml)
    from(tasks.dokkaHtml.flatMap { it.outputDirectory })
    archiveClassifier.set("html-docs")
}

tasks.register<Jar>("dokkaJavadocJar") {
    dependsOn(tasks.dokkaJavadoc)
    from(tasks.dokkaJavadoc.flatMap { it.outputDirectory })
    archiveClassifier.set("javadoc")
}


publishing {
    publications {
        create<MavenPublication>("mavenJava") {
            from(components["kotlin"])

            artifact(tasks["dokkaHtmlJar"])
            artifact(tasks["dokkaJavadocJar"])

            pom {
                name.set("Permission Checker")
                description.set("A project for checking permissions")
                url.set("https://github.com/ThunderNetworkRaD/permission-checker")
                licenses {
                    license {
                        name.set("The Apache License, Version 2.0")
                        url.set("http://www.apache.org/licenses/LICENSE-2.0.txt")
                    }
                }
                developers {
                    developer {
                        id.set("thundernetwork")
                        name.set("Thunder Network")
                        email.set("thundernetwork.org@gmail.com")
                    }
                }
                scm {
                    connection.set("scm:git:git://github.com/ThunderNetworkRaD/permission-checker.git")
                    developerConnection.set("scm:git:ssh://github.com/ThunderNetworkRaD/permission-checker.git")
                    url.set("https://github.com/ThunderNetworkRaD/permission-checker")
                }
            }
        }
    }

    repositories {
        maven {
            name = "OSSRH"
            url = uri("https://oss.sonatype.org/service/local/staging/deploy/maven2/")
            credentials {
                username = System.getenv("MAVEN_USERNAME")
                password = System.getenv("MAVEN_PASSWORD")
            }
        }
        maven {
            name = "GitHub"
            url = uri("https://maven.pkg.github.com/ThunderNetworkRaD/permission-checker")
            credentials {
                username = System.getenv("GITHUB_ACTOR")
                password = System.getenv("GPJ_PASSWORD")
            }
        }
    }
}