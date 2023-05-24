import React, { useState } from "react";
import { Container, Spinner, Table, TableContainer, Tbody, Text, Th, Thead, Tr, Td, OrderedList, ListItem, UnorderedList, FormControl, Input, Button} from "@chakra-ui/react";
import { useParams, Link } from 'react-router-dom'
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_RECIPE } from "../utils/queries";
import '../styles/style.css'
import auth from "../utils/auth";
import { ADD_COMMENT } from "../utils/mutations";

export default function Recipe() {
  const { recipeId } = useParams()
  const [comment, setComment] = useState('')

const {data, loading, refetch} = useQuery(QUERY_RECIPE, {variables: {recipeId: recipeId}})
    const [addComment] = useMutation(ADD_COMMENT)

    //TODO: Use a mutation hook to push the comment into the database
    const handleCommentChange = (e) => {
        setComment(e.target.value)
    }

    const handleCommentSubmit = (e) => {
        e.preventDefault()
        if (comment.length > 1) {
            addComment({ variables: { recipeId: recipeId, commentText: comment } })
            setComment('')
            refetch().then(() => {console.log("Data refetched")})
        }

    }

    if (loading) {
        return <Spinner />
    }

  const recipe = data?.recipe || null
  
  if (!recipe) {
    return <p>Something went wrong</p>
  }

  return (
    <div>
        <Container className="recipeHeader">
          <h1>{recipe.name}</h1>
          <Text>{recipe.description}</Text>
          <p>By: {recipe.recipeAuthor.username}</p>
        </Container>
            <Container className="ingredientsContainer">
              <TableContainer className="measurementStyling">
                <Table>
                  <Thead className="measurementFields">
                    <Tr>
                      <Th>Ingredient:</Th>
                      <Th>Amount:</Th>
                      <Th>Measurement:</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {recipe.ingredients.map((ingredient) => (
                      <Tr key={ingredient.ingredientName}>
                        <Td>
                          {ingredient.ingredientName.charAt(0).toUpperCase() +
                            ingredient.ingredientName.slice(1)}
                        </Td>
                        <Td>{ingredient.ingredientAmount}</Td>
                        <Td>
                          {ingredient.ingredientUnit.charAt(0).toUpperCase() +
                            ingredient.ingredientUnit.slice(1)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Container>
      <Container className="stepsContainer">
        <h1 className="stepsHeader">Steps</h1>
        <OrderedList className="stepsList">
          {recipe.steps.map((step) => (
            <ListItem key={step.order}>{step.stepText}</ListItem>
          ))}
        </OrderedList>
      </Container>
      <Container>
        <h1 className="stepList">Comments:</h1>
        {recipe?.comments ? (
          <Container>
            <UnorderedList listStyleType="none">
              {recipe.comments.map((comment, index) => (
                <ListItem key={index}>
                  <UnorderedList listStyleType="none">
                    <ListItem>
                      {comment.commentAuthor.username} said this at {comment.createdAt}
                    </ListItem>
                    <ListItem>{comment.commentText}</ListItem>
                  </UnorderedList>
                </ListItem>
              ))}
            </UnorderedList>
          </Container>
        ) : (
          <Container className="Comments">
            <Text>No comments yet. </Text>
          </Container>
        )}
        {auth.loggedIn() ? (
          <React.Fragment>
          <FormControl>
            <Input
              type="textarea"
              value={comment}
              placeholder="Thoughts?"
              onChange={handleCommentChange}
            />
          </FormControl>
          <Button onClick={handleCommentSubmit}>Submit</Button>
          </React.Fragment>
        ) : (
          <Text className="loginMessage">
            You must be logged in to post or comment.<Link className="loginLink" to="/login"> Log in</Link> or{" "}
            <Link className="loginLink" to="/signUp">Sign up</Link>
          </Text>
        )}
      </Container>
    </div>

  );
}