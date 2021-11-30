import re, codecs

class StrTools():
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
            return StrTools.getStrNonSepcialChars(inputName).lower()

    @staticmethod
    def getClassName(inputName: str):
        """generates a string with a first upper case char and no special chars"""
        if not inputName:
            return ""
        else:
            return "".join(StrTools.getStrNonSepcialChars(inputName)[0].upper()+StrTools.getStrNonSepcialChars(inputName)[1:])

    @staticmethod
    def getStrNonSepcialChars(inputStr: str):
        """removes all special chars from string"""
        return re.sub(StrTools.nonSpecialCharsRegEx, "", inputStr)

    @staticmethod
    def isCustomCode(inputVal: str):
        """checks if input sptring is a function/return-Statement or if its an basic variable type e.g. string, float, bool..."""
        return (inputVal.strip().startswith("def") or inputVal.strip().startswith("return"))

    @staticmethod
    def getCastValue(inputType: str, inputVal: str):
        """returns the casted value if the type is known"""
        inputVal = inputVal.strip()

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
    def getCustomCodeMethodName(propName: str, propValue: str):
        return "get_"+StrTools.getVarName(propName)+"()"
    
    @staticmethod
    def getCustomCodeMethodContent(prop: object):
        methodContent = StrTools.removeMethodHeader(prop.value)
        
        values = dict()
        values["methodHeader"] = "def "+prop.methodCallerStr[:-2]+"(self):"
        values["methodComment"] = r'"""'+"Initialization of property <"+prop.name+">"+r'"""'
        values["methodContent"] = methodContent

        for k, v in values.items():
            values[k] = codecs.decode(values[k], StrTools.stdRawEncoding)
        

        return values
        
    
    @staticmethod 
    def removeMethodHeader(inputVal: str):
        return re.sub(StrTools.methodHeaderRegEx, "", inputVal).strip()
