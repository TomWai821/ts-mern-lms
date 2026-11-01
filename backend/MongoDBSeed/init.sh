echo "Importing all JSON files..."
for file in /docker-entrypoint-initdb.d/*.json; do
  collection=$(basename "$file")
  collection=${collection#test.}
  collection=${collection%.json}
  echo "Importing $file into collection $collection..."
  mongoimport --db test --collection "$collection" \
              --file "$file" --jsonArray
done