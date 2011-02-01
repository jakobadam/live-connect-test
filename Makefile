OUTPUT = bin
SOURCES := $(shell find src -type f -name \*.java)
LIBS = $(JAVA_HOME)/jre/lib/plugin.jar
FLAGS = -target 1.5 -classpath $(LIBS) -d $(OUTPUT)
KEYSTORE_ALIAS = 'dev'
KEYSTORE_PASS = '123456'

all: jar

build:
	@(mkdir -p $(OUTPUT))
	@(javac $(FLAGS) src/*.java)

# sign: jar
# 	@(jarsigner -storepass $(KEYSTORE_PASS) -signedjar applets.jar applet.jar $(KEYSTORE_ALIAS))
# 	@(mv applets.jar applet.jar)

jar: build
	@(jar cvf applet.jar -C bin/ .)
