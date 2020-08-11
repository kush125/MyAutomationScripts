#!python3
import os
import argparse

parser = argparse.ArgumentParser(description="Batch rename files in directory")

parser.add_argument("search", type=str, help="to be replaced text")
parser.add_argument("replace", type=str, help="text to use for replacement")
parser.add_argument(
    "--filetype",
    type=str,
    default=None,
    help="Only files with the given type will be renamed (e.g. .txt)"
)
parser.add_argument(
    "--path",
    type=str,
    default=".",
    help="Directory path that contains the files to be renamed"
)

args = parser.parse_args()

search = args.search
replace = args.replace
type_filter = args.filetype
path = args.path

print(f"Ranaming files at path {path}")

dir_content = os.listdir(path)
path_dir_content = [os.path.join(path, doc) for doc in dir_content]
# print(os.path.isfile(dir_content[0]))
# print(dir_content)
# print(type(dir_content))
# list comprehension

# isfile by default takes current path, to make it use different filepath we need to give full path
docs = [doc for doc in path_dir_content if os.path.isfile(doc)]
renamed = 0
# used f-strings to prevent mistake which is forgetting to type cast concatenated operands
print(f"{len(docs)} of {len(dir_content)} elements are files.")
for doc in docs:
    # separate name from extension
    full_doc_path, filetype = os.path.splitext(doc)
    doc_path = os.path.dirname(full_doc_path)
    doc_name = os.path.basename(full_doc_path)

    if filetype == type_filter or type_filter is None:

        if search in doc_name:
            new_doc_name = doc_name.replace(search, replace)
            new_doc_path = os.path.join(doc_path, new_doc_name) + filetype
            # we give full path name here as well
            os.rename(doc, new_doc_path)
            renamed += 1
            print(f"Renamed file {doc} to {new_doc_path}")
print(f"Renamed {renamed} of {len(docs)} files.")
