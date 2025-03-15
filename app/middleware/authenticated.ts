export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, user } = useUserSession();

  // Redirect the user to the login page if not authenticated
  if (!loggedIn.value) {
    // Add a toast notification to inform the user
    const toast = useToast();
    toast.add({
      title: "Authentication Required",
      description: "Please log in to access this page",
      color: "warning",
      duration: 3000
    });
    
    return navigateTo("/login");
  }
});
