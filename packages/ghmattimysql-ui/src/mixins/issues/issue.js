class Issue {
  constructor(title) {
    this.title = title;
    this.message = '';
    this.display = false;
  }

  get issue() {
    if (!this.display) return null;
    return {
      title: this.title,
      message: this.message,
    };
  }
}

export default Issue;
