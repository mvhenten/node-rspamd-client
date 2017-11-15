MAILDIR=$1
TARGET=$2
COUNT=0
SPAM_COUNT=0

echo "Scanning $MAILDIR"


# FILES=$(find $MAILDIR -type f);

function scan_spam {
    local TARGET=$1
    local FILE=$2

    COUNT=$(expr $COUNT + 1)
    
    echo -ne "SCANNING $FILE"\\r

    SPAM=$(rspamc "$FILE" | grep Spam); 

    if [[ "$SPAM" =~ "true" ]]; then 
        SPAM_COUNT=$(expr $SPAM_COUNT + 1);
        echo "Moving $FILE to $TARGET"
        
        mv $FILE $TARGET
    fi
}


export -f scan_spam

parallel -j40 scan_spam $TARGET ::: $(find $MAILDIR -type f)


echo "done, scanned $COUNT messages, found $SPAM_COUNT spam."
