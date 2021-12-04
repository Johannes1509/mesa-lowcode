import re, codecs

class GenTools():
    """Tools for code reorganization or method name generation; string/regex-based"""
    
    nonSpecialCharsRegEx = r"[^a-zA-Z0-9]"
    genericMethodPattern = 'def {methodName}(self):\n"""{methodComment}"""{methodContent}'
    methodHeaderRegEx = r".*\s*(def).*\(.*\):"
    stdRawEncoding = 'unicode_escape'

    @staticmethod
    def getVarName(inputName: str):
        """generates a string with a first lower case char and no special chars"""
        if not inputName:
            return ""
        else:
            return GenTools.getStrNonSepcialChars(inputName).lower()

    @staticmethod
    def getClassName(inputName: str):
        """generates a string with a first upper case char and no special chars"""
        if not inputName:
            return ""
        else:
            return "".join(GenTools.getStrNonSepcialChars(inputName)[0].upper()+GenTools.getStrNonSepcialChars(inputName)[1:])

    @staticmethod
    def getStrNonSepcialChars(inputStr: str):
        """removes all special chars from string"""
        return re.sub(GenTools.nonSpecialCharsRegEx, "", inputStr)

    @staticmethod
    def isCustomCode(inputVal: str):
        """checks if input sptring is a function/return-Statement or if its an basic variable type e.g. string, float, bool..."""
        return (inputVal.strip().startswith("def") or inputVal.strip().startswith("return"))

    @staticmethod
    def getCastValue(inputType: str, inputVal: str):
        """returns the casted value if the type is known"""
        inputVal = inputVal.strip()

        if not inputVal:
            return ""

        if(inputType == "str"):
            inputVal = '"'+''.join([char for char in inputVal if char not in ("'", "'", "`", "´")])+'"'
        if(inputType == "float"):
            inputVal = float(inputVal.replace(",", "."))
        if(inputType == "int"):
            inputVal = int(inputVal)
        if(inputType == "bool"):
            if(inputVal.lower() in ("0", "false")):
                inputVal = False
            elif (inputVal.lower() in ("1", "true")):
                inputVal = True
        

        return inputVal

    @staticmethod
    def getCustomMethodName(prefix:str, name: str):
        return prefix+GenTools.getVarName(name)+"()"
    
    def getCustomMethodContent(content: str, methodHeader: str, methodComment: str):
        methodContent = GenTools.removeMethodHeader(content)
        result = dict()
        result = {
            "methodHeader": "def "+methodHeader+"(self):",
            "methodComment":  r'"""'+methodComment+r'"""',
            "methodContent": methodContent
        }
        
        return result
    
    @staticmethod 
    def removeMethodHeader(inputVal: str):
        removedHeaderString = re.sub(GenTools.methodHeaderRegEx, "", inputVal)
        #remove unnecessary indent
        removedHeaderStringSplitted = removedHeaderString.split("\n")[1:]
        for index, line in enumerate(removedHeaderStringSplitted):
            removedHeaderStringSplitted[index] = line[4:]
        removedHeaderString = "\n".join(removedHeaderStringSplitted)
        return removedHeaderString
