#!/bin/bash

# rename_template.sh
# Script to rename AwesomeProject to a custom name and optionally update bundle identifiers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "React Native Template Rename Script"
echo "======================================"
echo ""

# Get the project name
read -p "Enter the new project name (required): " NEW_NAME

if [ -z "$NEW_NAME" ]; then
    echo -e "${RED}Error: Project name is required${NC}"
    exit 1
fi

# Validate project name (no spaces, special characters)
if ! [[ "$NEW_NAME" =~ ^[a-zA-Z][a-zA-Z0-9_]*$ ]]; then
    echo -e "${RED}Error: Project name must start with a letter and contain only letters, numbers, and underscores${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Project name: ${NEW_NAME}${NC}"
echo ""

# Get bundle identifiers (optional)
read -p "Enter iOS bundle identifier (optional, e.g., com.yourcompany.${NEW_NAME}): " IOS_BUNDLE_ID
read -p "Enter Android bundle identifier (optional, e.g., com.yourcompany.$(echo "$NEW_NAME" | tr '[:upper:]' '[:lower:]')): " ANDROID_BUNDLE_ID

echo ""
echo "======================================"
echo "Summary of changes:"
echo "======================================"
echo "Project name: AwesomeProject -> ${NEW_NAME}"
if [ ! -z "$IOS_BUNDLE_ID" ]; then
    echo "iOS bundle ID: org.reactjs.native.example.${NEW_NAME} -> ${IOS_BUNDLE_ID}"
fi
if [ ! -z "$ANDROID_BUNDLE_ID" ]; then
    echo "Android package: com.awesomeproject -> ${ANDROID_BUNDLE_ID}"
fi
echo ""

read -p "Do you want to proceed? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "Starting rename process..."

# Function to replace text in a file
replace_in_file() {
    local file=$1
    local search=$2
    local replace=$3
    
    if [ -f "$file" ]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|${search}|${replace}|g" "$file"
        else
            # Linux
            sed -i "s|${search}|${replace}|g" "$file"
        fi
        echo -e "${GREEN}✓${NC} Updated: $file"
    else
        echo -e "${YELLOW}⚠${NC} File not found: $file"
    fi
}

# 1. Update app.json
echo ""
echo "Updating app.json..."
replace_in_file "app.json" "AwesomeProject" "$NEW_NAME"

# Update .detoxrc.js
echo "Updating .detoxrc.js..."
replace_in_file ".detoxrc.js" "AwesomeProject" "$NEW_NAME"

# 2. Update Android files
echo ""
echo "Updating Android files..."

# Android settings.gradle
replace_in_file "android/settings.gradle" "AwesomeProject" "$NEW_NAME"

# Android strings.xml
replace_in_file "android/app/src/main/res/values/strings.xml" "AwesomeProject" "$NEW_NAME"

# Android MainActivity.kt
replace_in_file "android/app/src/main/java/com/awesomeproject/MainActivity.kt" "AwesomeProject" "$NEW_NAME"

# Android MainApplication.kt - no content changes needed, just package name

# 3. Update iOS files (before renaming directories)
echo ""
echo "Updating iOS files..."

# iOS Info.plist
replace_in_file "ios/AwesomeProject/Info.plist" "AwesomeProject" "$NEW_NAME"

# iOS Podfile
replace_in_file "ios/Podfile" "AwesomeProject" "$NEW_NAME"

# iOS xcworkspace
replace_in_file "ios/AwesomeProject.xcworkspace/contents.xcworkspacedata" "AwesomeProject" "$NEW_NAME"

# iOS xcscheme - rename file first
if [ -f "ios/AwesomeProject.xcodeproj/xcshareddata/xcschemes/AwesomeProject.xcscheme" ]; then
    replace_in_file "ios/AwesomeProject.xcodeproj/xcshareddata/xcschemes/AwesomeProject.xcscheme" "AwesomeProject" "$NEW_NAME"
fi

# iOS project.pbxproj
replace_in_file "ios/AwesomeProject.xcodeproj/project.pbxproj" "AwesomeProject" "$NEW_NAME"

# iOS AppDelegate.swift
replace_in_file "ios/AwesomeProject/AppDelegate.swift" "AwesomeProject" "$NEW_NAME"

# iOS LaunchScreen.storyboard
replace_in_file "ios/AwesomeProject/LaunchScreen.storyboard" "AwesomeProject" "$NEW_NAME"

# 4. Update bundle identifiers if provided, or use defaults
# For Android, if no custom bundle ID is provided, use com.{lowercasename}
ANDROID_PACKAGE="com.awesomeproject"
NEW_ANDROID_PACKAGE="com.$(echo "$NEW_NAME" | tr '[:upper:]' '[:lower:]')"

if [ ! -z "$ANDROID_BUNDLE_ID" ]; then
    echo ""
    echo "Updating Android bundle identifier to custom value..."
    NEW_ANDROID_PACKAGE="$ANDROID_BUNDLE_ID"
else
    echo ""
    echo "Updating Android package name to default format..."
fi

# Convert bundle ID to path (e.g., com.company.app -> com/company/app)
ANDROID_PATH=$(echo "$NEW_ANDROID_PACKAGE" | tr '.' '/')

# Update build.gradle with specific patterns
replace_in_file "android/app/build.gradle" "namespace \"$ANDROID_PACKAGE\"" "namespace \"$NEW_ANDROID_PACKAGE\""
replace_in_file "android/app/build.gradle" "applicationId \"$ANDROID_PACKAGE\"" "applicationId \"$NEW_ANDROID_PACKAGE\""

# Update package names in Kotlin files
replace_in_file "android/app/src/main/java/com/awesomeproject/MainActivity.kt" "package $ANDROID_PACKAGE" "package $NEW_ANDROID_PACKAGE"
replace_in_file "android/app/src/main/java/com/awesomeproject/MainApplication.kt" "package $ANDROID_PACKAGE" "package $NEW_ANDROID_PACKAGE"

# Update package name in androidTest Java files
replace_in_file "android/app/src/androidTest/java/com/awesomeproject/DetoxTest.java" "package $ANDROID_PACKAGE" "package $NEW_ANDROID_PACKAGE"

# Move Android source files to new package directory
if [ -d "android/app/src/main/java/com/awesomeproject" ]; then
    echo "Moving Android source files to new package directory..."
    mkdir -p "android/app/src/main/java/${ANDROID_PATH}"
    mv android/app/src/main/java/com/awesomeproject/*.kt "android/app/src/main/java/${ANDROID_PATH}/"
    # Clean up old directory structure
    rm -rf android/app/src/main/java/com/awesomeproject
    # Remove empty parent directories if they exist
    rmdir android/app/src/main/java/com 2>/dev/null || true
    echo -e "${GREEN}✓${NC} Moved Android source files"
fi

# Move Android test files to new package directory
if [ -d "android/app/src/androidTest/java/com/awesomeproject" ]; then
    echo "Moving Android test files to new package directory..."
    mkdir -p "android/app/src/androidTest/java/${ANDROID_PATH}"
    mv android/app/src/androidTest/java/com/awesomeproject/*.java "android/app/src/androidTest/java/${ANDROID_PATH}/"
    # Clean up old directory structure
    rm -rf android/app/src/androidTest/java/com/awesomeproject
    # Remove empty parent directories if they exist
    rmdir android/app/src/androidTest/java/com 2>/dev/null || true
    echo -e "${GREEN}✓${NC} Moved Android test files"
fi

# 5. Rename iOS directories and files first (before updating bundle ID)
echo ""
echo "Renaming iOS directories and files..."

if [ -d "ios/AwesomeProject" ]; then
    mv "ios/AwesomeProject" "ios/${NEW_NAME}"
    echo -e "${GREEN}✓${NC} Renamed ios/AwesomeProject -> ios/${NEW_NAME}"
fi

if [ -d "ios/AwesomeProject.xcodeproj" ]; then
    mv "ios/AwesomeProject.xcodeproj" "ios/${NEW_NAME}.xcodeproj"
    echo -e "${GREEN}✓${NC} Renamed ios/AwesomeProject.xcodeproj -> ios/${NEW_NAME}.xcodeproj"
fi

if [ -d "ios/AwesomeProject.xcworkspace" ]; then
    mv "ios/AwesomeProject.xcworkspace" "ios/${NEW_NAME}.xcworkspace"
    echo -e "${GREEN}✓${NC} Renamed ios/AwesomeProject.xcworkspace -> ios/${NEW_NAME}.xcworkspace"
fi

# Rename xcscheme file
if [ -f "ios/${NEW_NAME}.xcodeproj/xcshareddata/xcschemes/AwesomeProject.xcscheme" ]; then
    mv "ios/${NEW_NAME}.xcodeproj/xcshareddata/xcschemes/AwesomeProject.xcscheme" "ios/${NEW_NAME}.xcodeproj/xcshareddata/xcschemes/${NEW_NAME}.xcscheme"
    echo -e "${GREEN}✓${NC} Renamed AwesomeProject.xcscheme -> ${NEW_NAME}.xcscheme"
fi

# Update iOS bundle identifier
if [ ! -z "$IOS_BUNDLE_ID" ]; then
    echo ""
    echo "Updating iOS bundle identifier to custom value..."
    # Replace the dynamic bundle identifier with the custom one
    replace_in_file "ios/${NEW_NAME}.xcodeproj/project.pbxproj" "org.reactjs.native.example.\$(PRODUCT_NAME:rfc1034identifier)" "$IOS_BUNDLE_ID"
else
    echo ""
    echo "Updating iOS bundle identifier to default format..."
    # Update to match the new project name in the default format
    NEW_IOS_BUNDLE="org.reactjs.native.example.${NEW_NAME}"
    # Since PRODUCT_NAME gets replaced with the project name, we just need to ensure consistency
    # The $(PRODUCT_NAME:rfc1034identifier) will automatically use the new project name
    echo -e "${GREEN}✓${NC} iOS bundle identifier will use: ${NEW_IOS_BUNDLE}"
fi

# 6. Final message
echo ""
echo "======================================"
echo -e "${GREEN}✓ Rename completed successfully!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Run 'yarn ios:pods' to update iOS dependencies"
echo "2. Run 'yarn start' to start the Metro bundler"
echo "3. Run 'yarn ios' or 'yarn android' to test the app"
echo ""
echo -e "${YELLOW}Note: You may need to clean build folders:${NC}"
echo "  - iOS: cd ios && xcodebuild clean"
echo "  - Android: cd android && ./gradlew clean"
echo ""
