#!python3
import os

search = "file"
replace = "textdoc"
type_filter = ".txt"
targetpath = 'C:\\Users\\soul\\MyScripts\\junk\\'

dir_content = os.listdir(targetpath)
# print(os.path.isfile(dir_content[0]))
print(dir_content)
# print(type(dir_content))
# list comprehension

# isfile by default takes current path, to make it use different filepath we need to give full path
docs = [doc for doc in dir_content if os.path.isfile(targetpath + doc)]

renamed = 0
# used f-strings to prevent mistake which is forgetting to type cast concatenated operands
print(f"{len(docs)} of {len(dir_content)} elements are files.")
for doc in docs:
    doc_name, filetype = os.path.splitext(doc)

    if filetype == type_filter:

        if search in doc_name:
            new_name = doc_name.replace(search, replace) + filetype
            # we give full path name here as well
            os.rename(targetpath + doc, targetpath + new_name)
            renamed += 1
            print(f"Renamed file {doc} to {new_name}")
print(f"Renamed {renamed} of {len(docs)} files.")
