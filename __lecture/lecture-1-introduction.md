# [7-1]

# Introduction to Databases

---

## Types of databases

- Text database
- Desktop database
- Relational database (SQL)
- Object-oriented databases (NoSQL)

---

### SQL vs NoSQL

<img src={'./assets/mongo_vs_relational.png' />

---

## Intro to MongoDB\*

_\* stands for Humongous Database._

---

- No **normalization** data: i.e. spreading across many tables
- No Schema
- No need for complex SQL join commands.

---

- Stores data together in a document
- Gives us lots of flexibility
- Allows you to get started before the exact bd requirements are known.
- Ability to adapt and improve later.

---

Data is stored a **Document** in a **Collection** in a **Database**

<img src='./assets/db-coll-doc.png' />

---

### Documents

- Documents are JSON objects.

---

### Example of a Document

```json
{
  "name": "James Tiberius Kirk",
  "dob": "March 22",
  "born": 2233,
  "died": 2371,
  "titles": ["Commander", "Captain", "Admiral"],
  "family": {
    "father": "George Kirk",
    "mother": "Winona Kirk",
    "siblings": [
      {
        "brother_1": "George Samuel Kirk"
      }
    ]
  }
}
```

---

### Documents can have different structures

```json
{
  "id": "1234556",
  "name": "Doctor Evil",
  "age": 42
}

{
  "id": "987654",
  "name": "Austin Powers",
  "description": "International Man of Mystery"
}
```

---

## Mongo Product

<img src='./assets/mongo_overview.png' />
